import json
import mimetypes
import os
import re
import sys
import uuid
from argparse import ArgumentParser
from io import BytesIO
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
HTML_DIR = ROOT / "outputs" / "final-posts" / "html"
JSON_DIR = ROOT / "outputs" / "final-posts" / "json"
DB_READY_DIR = ROOT / "outputs" / "db-ready" / "development"
WEBP_DIR = ROOT / "outputs" / "storage-ready" / "development"
DEFAULT_BUCKET = "images"
DEFAULT_RESOURCES_TABLE = "resources"
PLACEHOLDER_ENV_VALUES = {
    "https://your-project-id.supabase.co",
    "replace-with-local-secret",
}


def load_env_file(path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def env_value(primary, fallback=None, default=None):
    value = os.environ.get(primary) or (os.environ.get(fallback) if fallback else None)
    if value in PLACEHOLDER_ENV_VALUES:
        return default
    return value or default


def supabase_request(
    base_url,
    service_key,
    method,
    path,
    body=None,
    content_type="application/json",
    extra_headers=None,
):
    url = base_url.rstrip("/") + path
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
    }
    if body is not None:
        headers["Content-Type"] = content_type
    if extra_headers:
        headers.update(extra_headers)
    req = Request(url, data=body, headers=headers, method=method)
    try:
        with urlopen(req, timeout=60) as response:
            data = response.read()
            if not data:
                return None
            text = data.decode("utf-8")
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                return text
    except HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Supabase request failed {error.code}: {details}") from error


def get_blog(base_url, service_key, slug):
    query = f"/rest/v1/blogs?slug=eq.{quote(slug)}&select=id,thumbnail,slug,title&limit=1"
    rows = supabase_request(base_url, service_key, "GET", query)
    if not rows:
        raise RuntimeError(f"Blog not found for slug: {slug}")
    return rows[0]


def infer_base_url(package):
    file_path = package.get("thumbnail_image", {}).get("file_path")
    if isinstance(file_path, str) and file_path.startswith("http"):
        match = re.match(r"^(https://[^/]+\.supabase\.co)", file_path)
        if match:
            return match.group(1)
    raise RuntimeError("Missing SUPABASE_URL and could not infer a Supabase base URL from the package")


def infer_thumbnail_id(package):
    file_path = package.get("thumbnail_image", {}).get("file_path")
    if isinstance(file_path, str):
        match = re.search(r"/([0-9a-fA-F-]{36})\.webp(?:$|\?)", file_path)
        if match:
            return match.group(1)
    return str(uuid.uuid4())


def collect_template_file_paths(*packages):
    paths = []
    for package in packages:
        if not isinstance(package, dict):
            continue
        file_path = package.get("thumbnail_image", {}).get("file_path")
        if isinstance(file_path, str) and file_path.strip():
            paths.append(file_path.strip())
    return paths


def is_content_storage_path(file_path):
    return isinstance(file_path, str) and ("/content/" in file_path or "/blogs/contents/" in file_path)


def package_thumbnail_source(*packages):
    fallback = None
    for file_path in collect_template_file_paths(*packages):
        if fallback is None:
            fallback = file_path
        if is_content_storage_path(file_path):
            continue
        return file_path
    return fallback


def to_webp(source_path, output_path, width=None, quality=86):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source_path) as image:
        image = image.convert("RGB")
        if width and image.width > width:
            ratio = width / image.width
            height = round(image.height * ratio)
            image = image.resize((width, height), Image.Resampling.LANCZOS)
        image.save(output_path, "WEBP", quality=quality, method=6)


def upload_object(base_url, service_key, bucket, object_path, file_path):
    body = file_path.read_bytes()
    content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
    encoded_path = "/".join(quote(part) for part in object_path.split("/"))
    return supabase_request(
        base_url,
        service_key,
        "POST",
        f"/storage/v1/object/{quote(bucket)}/{encoded_path}",
        body=body,
        content_type=content_type,
    )


def update_blog(base_url, service_key, blog_id, patch):
    body = json.dumps(patch, ensure_ascii=False).encode("utf-8")
    query = f"/rest/v1/blogs?id=eq.{quote(blog_id)}"
    return supabase_request(base_url, service_key, "PATCH", query, body=body)


def image_ratio(width, height):
    if not width or not height:
        return None
    if width == height:
        return "1:1"
    return "landscape" if width > height else "portrait"


def read_remote_image(public_url):
    req = Request(public_url, method="GET")
    with urlopen(req, timeout=60) as response:
        data = response.read()
        content_type = response.headers.get_content_type() or mimetypes.guess_type(public_url)[0] or "image/webp"
    with Image.open(BytesIO(data)) as image:
        width, height = image.size
    return {
        "content_type": content_type,
        "file_size": len(data),
        "width": width,
        "height": height,
    }


def build_thumbnail_resource(resource_id, bucket, object_path, file_name, file_size, mime_type, width, height):
    object_dir = object_path.rsplit("/", 1)[0]
    return {
        "id": resource_id,
        "file_name": file_name,
        "file_size": file_size,
        "mime_type": mime_type,
        "file_path": f"{bucket}/{object_dir}",
        "source": "BLOG_THUMBNAIL",
        "image_ratio": image_ratio(width, height),
        "object_path": object_path,
        "width": width,
        "height": height,
    }


def upsert_resource(base_url, service_key, table, resource):
    body = json.dumps([{
        "id": resource["id"],
        "file_name": resource["file_name"],
        "file_size": resource["file_size"],
        "mime_type": resource["mime_type"],
        "file_path": resource["file_path"],
        "source": resource["source"],
        "image_ratio": resource["image_ratio"],
    }], ensure_ascii=False).encode("utf-8")
    query = f"/rest/v1/{quote(table)}?on_conflict=id&select=id,file_name,file_path,image_ratio"
    return supabase_request(
        base_url,
        service_key,
        "POST",
        query,
        body=body,
        content_type="application/json",
        extra_headers={"Prefer": "resolution=merge-duplicates,return=representation"},
    )


def replace_sources(html, replacements):
    for old, new in replacements.items():
        html = html.replace(old, new)
    return html


def strip_duplicate_top_media(html, duplicate_urls):
    cleaned = html
    for url in duplicate_urls:
        if not url:
            continue
        escaped = re.escape(url)
        cleaned = re.sub(
            rf"<figure\b[^>]*>.*?<img[^>]+src=\"{escaped}\"[^>]*>.*?</figure>\s*",
            "",
            cleaned,
            flags=re.IGNORECASE | re.DOTALL,
        )
        cleaned = re.sub(
            rf"<p\b[^>]*>\s*<img[^>]+src=\"{escaped}\"[^>]*>\s*</p>\s*",
            "",
            cleaned,
            flags=re.IGNORECASE | re.DOTALL,
        )
        cleaned = re.sub(
            rf"<img[^>]+src=\"{escaped}\"[^>]*>\s*",
            "",
            cleaned,
            flags=re.IGNORECASE,
        )
    return cleaned.strip()


def parse_args():
    parser = ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--slug", action="append", default=[])
    return parser.parse_args()


def load_db_ready_original_package(json_path):
    db_ready_path = DB_READY_DIR / json_path.name
    if not db_ready_path.exists():
        return None

    payload = json.loads(db_ready_path.read_text(encoding="utf-8"))
    original_package = payload.get("original_package")
    return original_package if isinstance(original_package, dict) else None


def pick_html_source(html_path, *packages):
    for package in packages:
        if not isinstance(package, dict):
            continue
        package_html = package.get("content_html")
        if isinstance(package_html, str) and "/storage/v1/object/public/" in package_html:
            return package_html
    return html_path.read_text(encoding="utf-8")


def parse_object_path(public_url, bucket):
    marker = f"/storage/v1/object/public/{bucket}/"
    if marker not in public_url:
        return None
    return public_url.split(marker, 1)[1]


def resolve_local_image(source, html_path):
    source_path = Path(source)
    if source_path.is_absolute() and source_path.exists():
        return source_path

    candidates = [
        (html_path.parent / source).resolve(),
        (ROOT / source).resolve(),
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise RuntimeError(f"Missing local image: {source}")


def prepare_remote_upload(public_url, bucket, resource_id=None):
    object_path = parse_object_path(public_url, bucket)
    if not object_path:
        raise RuntimeError(f"Could not infer storage object path: {public_url}")

    upload = {"local": None, "object_path": object_path, "url": public_url}
    resource = None
    if resource_id:
        remote_image = read_remote_image(public_url)
        resource = build_thumbnail_resource(
            resource_id=resource_id,
            bucket=bucket,
            object_path=object_path,
            file_name=Path(object_path).name,
            file_size=remote_image["file_size"],
            mime_type=remote_image["content_type"],
            width=remote_image["width"],
            height=remote_image["height"],
        )
    return upload, resource


def prepare_local_upload(local_path, base_url, bucket, object_path, width, resource_id=None):
    local_path = Path(local_path)
    webp_path = WEBP_DIR / Path(object_path)
    to_webp(local_path, webp_path, width=width)
    public_url = f"{base_url.rstrip('/')}/storage/v1/object/public/{bucket}/{object_path}"
    upload = {"local": str(local_path), "object_path": object_path, "url": public_url}

    resource = None
    if resource_id:
        with Image.open(webp_path) as image:
            image_width, image_height = image.size
        resource = build_thumbnail_resource(
            resource_id=resource_id,
            bucket=bucket,
            object_path=object_path,
            file_name=webp_path.name,
            file_size=webp_path.stat().st_size,
            mime_type=mimetypes.guess_type(webp_path.name)[0] or "image/webp",
            width=image_width,
            height=image_height,
        )

    return upload, resource, webp_path


def main():
    load_env_file(ROOT / ".env")

    args = parse_args()
    dry_run = args.dry_run
    slug_filter = set(args.slug)
    base_url = env_value("DREAMDECO_SUPABASE_URL", "SUPABASE_URL")
    service_key = env_value("DREAMDECO_SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_ROLE_KEY")
    bucket = env_value("DREAMDECO_SUPABASE_STORAGE_BUCKET", "SUPABASE_STORAGE_BUCKET", DEFAULT_BUCKET)
    resources_table = env_value("DREAMDECO_SUPABASE_RESOURCES_TABLE", "SUPABASE_RESOURCES_TABLE", DEFAULT_RESOURCES_TABLE)

    WEBP_DIR.mkdir(parents=True, exist_ok=True)

    results = []
    for json_path in sorted(JSON_DIR.glob("*.json")):
        package = json.loads(json_path.read_text(encoding="utf-8"))
        db_ready_package = load_db_ready_original_package(json_path)
        slug = package["slug"]
        if slug_filter and slug not in slug_filter:
            continue

        if not base_url:
            if not dry_run:
                raise RuntimeError("Missing required environment variable: DREAMDECO_SUPABASE_URL (or fallback SUPABASE_URL)")
            base_url = infer_base_url(package)

        if service_key:
            blog = get_blog(base_url, service_key, slug)
            thumbnail_id = blog.get("thumbnail") or str(uuid.uuid4())
        elif dry_run:
            blog = {"id": f"dry-run:{slug}", "slug": slug, "thumbnail": None, "title": package.get("title")}
            thumbnail_id = infer_thumbnail_id(package)
        else:
            raise RuntimeError("Missing required environment variable: DREAMDECO_SUPABASE_SERVICE_ROLE_KEY (or fallback SUPABASE_SERVICE_ROLE_KEY)")

        html_path = HTML_DIR / f"{json_path.stem}.html"
        html = pick_html_source(html_path, package, db_ready_package)
        image_sources = re.findall(r'<img[^>]+src="([^"]+)"', html)
        replacements = {}
        body_uploads = []
        thumbnail_resource = None
        thumbnail_upload = None
        thumbnail_source = package_thumbnail_source(db_ready_package, package)

        if thumbnail_source:
            if thumbnail_source.startswith("http"):
                thumbnail_upload, thumbnail_resource = prepare_remote_upload(
                    thumbnail_source,
                    bucket,
                    resource_id=thumbnail_id,
                )
            else:
                thumbnail_local_path = resolve_local_image(thumbnail_source, html_path)
                thumbnail_upload, thumbnail_resource, thumbnail_webp_path = prepare_local_upload(
                    thumbnail_local_path,
                    base_url,
                    bucket,
                    f"thumbnails/{thumbnail_id}.webp",
                    width=1280,
                    resource_id=thumbnail_id,
                )
                if not dry_run:
                    upload_object(base_url, service_key, bucket, thumbnail_upload["object_path"], thumbnail_webp_path)

        for src in image_sources:
            if thumbnail_source and src == thumbnail_source:
                replacements[src] = thumbnail_upload["url"]
                continue
            if src.startswith("http"):
                public_url = src
                object_path = parse_object_path(public_url, bucket)
                if not object_path:
                    raise RuntimeError(f"Could not infer storage object path for {slug}: {src}")
                replacements[src] = public_url
                body_uploads.append({"local": None, "object_path": object_path, "url": public_url})
                continue

            local_path = resolve_local_image(src, html_path)
            content_id = str(uuid.uuid4())
            object_path = f"content/{slug}/{content_id}.webp"
            body_upload, _, webp_path = prepare_local_upload(
                local_path,
                base_url,
                bucket,
                object_path,
                width=1280,
            )
            public_url = body_upload["url"]
            replacements[src] = public_url
            body_uploads.append(body_upload)

            if not dry_run:
                upload_object(base_url, service_key, bucket, object_path, webp_path)

        updated_html = replace_sources(html, replacements)
        uploads = ([thumbnail_upload] if thumbnail_upload else []) + body_uploads
        thumbnail_url = thumbnail_upload["url"] if thumbnail_upload else None
        duplicate_urls = set(collect_template_file_paths(package, db_ready_package))
        if thumbnail_url:
            duplicate_urls.add(thumbnail_url)
        updated_html = strip_duplicate_top_media(updated_html, duplicate_urls)
        if not dry_run:
            update_blog(
                base_url,
                service_key,
                blog["id"],
                {"content": updated_html, "thumbnail": thumbnail_id},
            )
            upsert_resource(base_url, service_key, resources_table, thumbnail_resource)

        package["content_html"] = updated_html
        package["storage_uploads"] = uploads
        if thumbnail_url:
            package["thumbnail_image"]["file_path"] = thumbnail_url
        package.pop("featured_image", None)
        filtered_content_images = []
        for image in package.get("content_images", []):
            old = image["file_path"].replace("outputs/", "../../")
            if old in replacements:
                image["file_path"] = replacements[old]
            if image["file_path"] in duplicate_urls:
                continue
            if image["file_path"] not in updated_html:
                continue
            filtered_content_images.append(image)
        package["content_images"] = filtered_content_images
        if not dry_run:
            json_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

        results.append({
            "slug": slug,
            "blog_id": blog["id"],
            "thumbnail": thumbnail_id,
            "thumbnail_resource": thumbnail_resource,
            "uploads": uploads,
        })

    report_path = ROOT / "outputs" / "storage-ready" / "development" / "upload-report.json"
    if not dry_run:
        report_path.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "dry_run": dry_run,
        "updated": len(results),
        "resources_table": resources_table,
        "report": None if dry_run else str(report_path),
        "results": results,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
