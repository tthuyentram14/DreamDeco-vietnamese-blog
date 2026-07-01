import { readFile, writeFile, mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ROOT = process.cwd();
const DEFAULT_BUCKET = "images";
const DEFAULT_RESOURCES_TABLE = "resources";

function loadEnvFile(file = ".env") {
  let text = "";
  try {
    text = readFileSync(file, "utf8");
  } catch {
    return;
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function envValue(primary, fallback, defaultValue) {
  return process.env[primary] || (fallback ? process.env[fallback] : undefined) || defaultValue;
}

function pngSize(buffer) {
  if (buffer.toString("ascii", 1, 4) !== "PNG") return { width: null, height: null };
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function imageRatio(width, height) {
  if (!width || !height) return null;
  if (width === height) return "1:1";
  return width > height ? "landscape" : "portrait";
}

function restUrl(baseUrl, table, query = "") {
  return `${baseUrl.replace(/\/$/, "")}/rest/v1/${table}${query}`;
}

function storageUrl(baseUrl, bucket, objectPath) {
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath.split("/").map(encodeURIComponent).join("/")}`;
}

function publicUrl(baseUrl, bucket, objectPath) {
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${objectPath}`;
}

function headers(serviceKey, extra = {}) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    ...extra,
  };
}

async function request(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!response.ok) throw new Error(`Supabase request failed ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

function resolveLocal(source) {
  const direct = path.resolve(ROOT, source);
  return direct;
}

async function uploadObject({ baseUrl, serviceKey, bucket, objectPath, localPath }) {
  const body = await readFile(localPath);
  await request(storageUrl(baseUrl, bucket, objectPath), {
    method: "POST",
    headers: headers(serviceKey, { "Content-Type": "image/png", "x-upsert": "true" }),
    body,
  });
  return { body, url: publicUrl(baseUrl, bucket, objectPath) };
}

async function main() {
  loadEnvFile();
  const slug = process.argv[2];
  if (!slug) throw new Error("Usage: node scripts/upload-single-blog-images-node.mjs <slug>");

  const baseUrl = envValue("DREAMDECO_SUPABASE_URL", "SUPABASE_URL");
  const serviceKey = envValue("DREAMDECO_SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_ROLE_KEY");
  const bucket = envValue("DREAMDECO_SUPABASE_STORAGE_BUCKET", "SUPABASE_STORAGE_BUCKET", DEFAULT_BUCKET);
  const resourcesTable = envValue("DREAMDECO_SUPABASE_RESOURCES_TABLE", "SUPABASE_RESOURCES_TABLE", DEFAULT_RESOURCES_TABLE);
  if (!baseUrl || !serviceKey) throw new Error("Missing Supabase env vars");

  const jsonPath = path.join(ROOT, "outputs", "final-posts", "json", `${slug}.json`);
  const htmlPath = path.join(ROOT, "outputs", "final-posts", "html", `${slug}.html`);
  const pkg = JSON.parse(await readFile(jsonPath, "utf8"));
  let html = await readFile(htmlPath, "utf8");

  const blogRows = await request(
    restUrl(baseUrl, "blogs", `?slug=eq.${encodeURIComponent(slug)}&select=id,thumbnail,slug,title&limit=1`),
    { method: "GET", headers: headers(serviceKey) },
  );
  if (!blogRows.length) throw new Error(`Blog not found for slug: ${slug}`);
  const blog = blogRows[0];
  const thumbnailId = blog.thumbnail || randomUUID();
  const uploads = [];

  const thumbnailLocal = resolveLocal(pkg.thumbnail_image.file_path);
  const thumbnailObject = `thumbnails/${thumbnailId}.png`;
  const thumbnailUpload = await uploadObject({ baseUrl, serviceKey, bucket, objectPath: thumbnailObject, localPath: thumbnailLocal });
  const thumbSize = pngSize(thumbnailUpload.body);
  const thumbnailResource = {
    id: thumbnailId,
    file_name: path.basename(thumbnailObject),
    file_size: thumbnailUpload.body.length,
    mime_type: "image/png",
    file_path: `${bucket}/thumbnails`,
    source: "BLOG_THUMBNAIL",
    image_ratio: imageRatio(thumbSize.width, thumbSize.height),
  };
  uploads.push({ local: pkg.thumbnail_image.file_path, object_path: thumbnailObject, url: thumbnailUpload.url });
  pkg.thumbnail_image.file_path = thumbnailUpload.url;

  for (const image of pkg.content_images) {
    const oldPath = image.file_path;
    const localPath = resolveLocal(oldPath);
    const objectPath = `content/${slug}/${randomUUID()}.png`;
    const bodyUpload = await uploadObject({ baseUrl, serviceKey, bucket, objectPath, localPath });
    html = html.replaceAll(oldPath, bodyUpload.url);
    image.file_path = bodyUpload.url;
    uploads.push({ local: oldPath, object_path: objectPath, url: bodyUpload.url });
  }

  await request(restUrl(baseUrl, "blogs", `?id=eq.${encodeURIComponent(blog.id)}`), {
    method: "PATCH",
    headers: headers(serviceKey, { "Content-Type": "application/json" }),
    body: JSON.stringify({ content: html, thumbnail: thumbnailId }),
  });

  await request(restUrl(baseUrl, resourcesTable, "?on_conflict=id&select=id,file_name,file_path,image_ratio"), {
    method: "POST",
    headers: headers(serviceKey, {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify([thumbnailResource]),
  });

  pkg.content_html = html;
  pkg.storage_uploads = uploads;
  await writeFile(jsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  await writeFile(htmlPath, html, "utf8");
  const reportDir = path.join(ROOT, "outputs", "storage-ready", "development");
  await mkdir(reportDir, { recursive: true });
  const result = { slug, blog_id: blog.id, thumbnail: thumbnailId, thumbnail_resource: thumbnailResource, uploads };
  await writeFile(path.join(reportDir, `${slug}-upload-report.json`), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
