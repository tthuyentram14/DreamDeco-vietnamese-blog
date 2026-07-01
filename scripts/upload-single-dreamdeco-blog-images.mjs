import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const SLUG = process.argv[2] || "can-ho-viet-nam-am-thoang-2026";
const PLACEHOLDER_ENV_VALUES = new Set([
  "https://your-project-id.supabase.co",
  "replace-with-local-secret",
]);

async function loadEnvFile(filePath = path.join(ROOT, ".env")) {
  let text = "";
  try {
    text = await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function envValue(primary, fallback, defaultValue) {
  const value = process.env[primary] || (fallback ? process.env[fallback] : undefined);
  if (PLACEHOLDER_ENV_VALUES.has(value)) return defaultValue;
  return value || defaultValue;
}

function requireEnv(primary, fallback) {
  const value = envValue(primary, fallback);
  if (!value) throw new Error(`Missing required environment variable: ${primary}${fallback ? ` (or ${fallback})` : ""}`);
  return value;
}

async function request(baseUrl, serviceKey, method, apiPath, body, contentType = "application/json", extraHeaders = {}) {
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    ...extraHeaders,
  };
  if (body !== undefined) headers["Content-Type"] = contentType;
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${apiPath}`, { method, headers, body });
  const text = await response.text();
  let parsed = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }
  if (!response.ok) {
    throw new Error(`Supabase request failed ${response.status}: ${JSON.stringify(parsed)}`);
  }
  return parsed;
}

function encodeObjectPath(objectPath) {
  return objectPath.split("/").map(encodeURIComponent).join("/");
}

function publicUrl(baseUrl, bucket, objectPath) {
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${objectPath}`;
}

function pngDimensions(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") return { width: null, height: null };
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function imageRatio(width, height) {
  if (!width || !height) return null;
  if (width === height) return "1:1";
  return width > height ? "landscape" : "portrait";
}

function resolveLocal(filePath) {
  if (path.isAbsolute(filePath)) return filePath;
  return path.join(ROOT, filePath);
}

async function uploadObject(baseUrl, serviceKey, bucket, objectPath, localPath) {
  const body = await readFile(localPath);
  await request(
    baseUrl,
    serviceKey,
    "POST",
    `/storage/v1/object/${encodeURIComponent(bucket)}/${encodeObjectPath(objectPath)}`,
    body,
    "image/png",
  );
  return body;
}

async function getBlog(baseUrl, serviceKey, slug) {
  const rows = await request(
    baseUrl,
    serviceKey,
    "GET",
    `/rest/v1/blogs?slug=eq.${encodeURIComponent(slug)}&select=id,thumbnail,slug,title&limit=1`,
  );
  if (!rows?.length) throw new Error(`Blog not found for slug: ${slug}`);
  return rows[0];
}

async function patchBlog(baseUrl, serviceKey, blogId, patch) {
  return request(
    baseUrl,
    serviceKey,
    "PATCH",
    `/rest/v1/blogs?id=eq.${encodeURIComponent(blogId)}`,
    JSON.stringify(patch),
  );
}

async function upsertResource(baseUrl, serviceKey, table, resource) {
  return request(
    baseUrl,
    serviceKey,
    "POST",
    `/rest/v1/${encodeURIComponent(table)}?on_conflict=id&select=id,file_name,file_path,image_ratio`,
    JSON.stringify([resource]),
    "application/json",
    { Prefer: "resolution=merge-duplicates,return=representation" },
  );
}

async function notifySlack(message) {
  const webhook = process.env.SLACK_ALERTS_WEBHOOK_URL;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch {
    // Do not mask the original upload failure.
  }
}

async function main() {
  await loadEnvFile();
  const baseUrl = requireEnv("DREAMDECO_SUPABASE_URL", "SUPABASE_URL");
  const serviceKey = requireEnv("DREAMDECO_SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_ROLE_KEY");
  const bucket = envValue("DREAMDECO_SUPABASE_STORAGE_BUCKET", "SUPABASE_STORAGE_BUCKET", "images");
  const resourcesTable = envValue("DREAMDECO_SUPABASE_RESOURCES_TABLE", "SUPABASE_RESOURCES_TABLE", "resources");

  const packagePath = path.join(ROOT, "outputs", "final-posts", "json", `${SLUG}.json`);
  const htmlPath = path.join(ROOT, "outputs", "final-posts", "html", `${SLUG}.html`);
  const pkg = JSON.parse(await readFile(packagePath, "utf8"));
  let html = await readFile(htmlPath, "utf8");
  const blog = await getBlog(baseUrl, serviceKey, SLUG);
  const thumbnailId = blog.thumbnail || crypto.randomUUID();
  const uploads = [];

  const thumbLocal = resolveLocal(pkg.thumbnail_image.file_path);
  const thumbObjectPath = `thumbnails/${thumbnailId}.png`;
  const thumbBytes = await uploadObject(baseUrl, serviceKey, bucket, thumbObjectPath, thumbLocal);
  const thumbStats = await stat(thumbLocal);
  const thumbDims = pngDimensions(thumbBytes);
  const thumbUrl = publicUrl(baseUrl, bucket, thumbObjectPath);
  const thumbnailResource = {
    id: thumbnailId,
    file_name: path.basename(thumbObjectPath),
    file_size: thumbStats.size,
    mime_type: "image/png",
    file_path: `${bucket}/thumbnails`,
    source: "BLOG_THUMBNAIL",
    image_ratio: imageRatio(thumbDims.width, thumbDims.height),
  };
  uploads.push({ local: pkg.thumbnail_image.file_path, object_path: thumbObjectPath, url: thumbUrl });

  for (const image of pkg.content_images || []) {
    const localPath = resolveLocal(image.file_path);
    const imageId = crypto.randomUUID();
    const objectPath = `content/${SLUG}/${imageId}.png`;
    await uploadObject(baseUrl, serviceKey, bucket, objectPath, localPath);
    const url = publicUrl(baseUrl, bucket, objectPath);
    html = html.replaceAll(image.file_path, url);
    uploads.push({ local: image.file_path, object_path: objectPath, url });
    image.file_path = url;
  }

  pkg.thumbnail_image.file_path = thumbUrl;
  pkg.content_html = html;
  pkg.storage_uploads = uploads;
  pkg.featured_image = undefined;
  delete pkg.featured_image;

  await patchBlog(baseUrl, serviceKey, blog.id, { content: html, thumbnail: thumbnailId });
  await upsertResource(baseUrl, serviceKey, resourcesTable, thumbnailResource);

  await mkdir(path.join(ROOT, "outputs", "db-ready", "development"), { recursive: true });
  await mkdir(path.join(ROOT, "outputs", "storage-ready", "development"), { recursive: true });
  await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  await writeFile(path.join(ROOT, "outputs", "packages", `${SLUG}.json`), `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  await writeFile(path.join(ROOT, "outputs", "packages", `${SLUG}.html`), html, "utf8");
  await writeFile(path.join(ROOT, "outputs", "db-ready", "development", `${SLUG}-uploaded.json`), `${JSON.stringify({ blog: { ...blog, thumbnail: thumbnailId }, original_package: pkg }, null, 2)}\n`, "utf8");
  const report = { slug: SLUG, blog_id: blog.id, thumbnail: thumbnailId, thumbnail_resource: thumbnailResource, uploads };
  await writeFile(path.join(ROOT, "outputs", "storage-ready", "development", `${SLUG}-upload-report.json`), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
}

main().catch(async (error) => {
  await notifySlack(`DreamDeco upload failure: slug=${SLUG}, step=image_storage_or_blog_patch, category=${error.name || "Error"}, action=developer_review_required`);
  console.error(error.message);
  process.exit(1);
});
