import { readFile } from "node:fs/promises";

const DEFAULTS = {
  blogsTable: "blogs",
  hashtagsTable: "hashtag_blogs",
  joinTable: "blog_hashtag_blogs",
};
const MIN_PUBLIC_BODY_CHARS = 8000;
const PLACEHOLDER_ENV_VALUES = new Set([
  "https://your-project-id.supabase.co",
  "replace-with-local-secret",
]);

async function loadEnvFile(path = ".env") {
  let text;
  try {
    text = await readFile(path, "utf8");
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
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function envValue(primary, fallback, defaultValue = undefined) {
  const value = process.env[primary] || (fallback ? process.env[fallback] : undefined);
  if (PLACEHOLDER_ENV_VALUES.has(value)) return defaultValue;
  return value || defaultValue;
}

function requireDreamDecoEnv(name) {
  const value = envValue(`DREAMDECO_${name}`, name);
  if (!value) {
    throw new Error(`Missing required environment variable: DREAMDECO_${name} (or fallback ${name})`);
  }
  return value;
}


function basename(value) {
  return String(value || "").split(/[\\/]/).filter(Boolean).pop() || "";
}

function publicBodyText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function publicBodyCharCount(html) {
  return [...publicBodyText(html)].length;
}

function assertMinimumPublicBodyLength(payloads) {
  const failures = [];
  for (const payload of payloads) {
    const slug = payload.blog?.slug || payload.original_package?.slug || "unknown";
    const content = payload.blog?.content || payload.original_package?.content_html || "";
    const count = publicBodyCharCount(content);
    if (count < MIN_PUBLIC_BODY_CHARS) {
      failures.push({ slug, public_body_chars: count, minimum: MIN_PUBLIC_BODY_CHARS });
    }
  }
  if (failures.length) {
    throw new Error("Refusing DB upload: public body text is below 8000 Vietnamese characters: " + JSON.stringify(failures));
  }
}

function collectTemplateImagePaths(payload) {
  const pkg = payload.original_package || payload;
  return [
    pkg?.thumbnail_image?.file_path,
  ].filter((value) => typeof value === "string" && value.trim());
}

function findTemplateImagesInContent(payload) {
  const content = payload.blog?.content || payload.original_package?.content_html || "";
  const templatePaths = collectTemplateImagePaths(payload);
  const imageSrcs = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  return imageSrcs.filter((src) => {
    const srcBase = basename(src);
    return templatePaths.some((templatePath) => src === templatePath || srcBase === basename(templatePath));
  });
}

function assertNoTemplateImagesInContent(payloads) {
  const failures = [];
  for (const payload of payloads) {
    const duplicates = findTemplateImagesInContent(payload);
    if (duplicates.length) {
      failures.push({ slug: payload.blog?.slug || payload.original_package?.slug || "unknown", duplicates });
    }
  }
  if (failures.length) {
    throw new Error("Refusing DB upload: thumbnail image appears inside production content_html: " + JSON.stringify(failures));
  }
}

function restUrl(baseUrl, table, query = "") {
  const trimmed = baseUrl.replace(/\/$/, "");
  return `${trimmed}/rest/v1/${table}${query}`;
}

function headers(serviceKey, extra = {}) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
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
  if (!response.ok) {
    throw new Error(`Supabase request failed ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function findUniqueSlug({ baseUrl, serviceKey, blogsTable, slug }) {
  const existingRows = await request(
    restUrl(baseUrl, blogsTable, `?slug=eq.${encodeURIComponent(slug)}&select=id,slug&limit=1`),
    { method: "GET", headers: headers(serviceKey) },
  );
  if (!existingRows.length) return slug;

  let suffix = 2;
  while (true) {
    const candidate = `${slug}-${suffix}`;
    const rows = await request(
      restUrl(baseUrl, blogsTable, `?slug=eq.${encodeURIComponent(candidate)}&select=id,slug&limit=1`),
      { method: "GET", headers: headers(serviceKey) },
    );
    if (!rows.length) return candidate;
    suffix++;
  }
}

async function upsertBlog({ baseUrl, serviceKey, blogsTable, blog, forceOverwrite }) {
  const existingRows = await request(
    restUrl(
      baseUrl,
      blogsTable,
      `?slug=eq.${encodeURIComponent(blog.slug)}&select=id,slug,title&limit=1`,
    ),
    {
      method: "GET",
      headers: headers(serviceKey),
    },
  );

  if (existingRows.length && forceOverwrite) {
    const existing = existingRows[0];
    const rows = await request(
      restUrl(
        baseUrl,
        blogsTable,
        `?id=eq.${encodeURIComponent(existing.id)}&select=id,slug,title`,
      ),
      {
        method: "PATCH",
        headers: headers(serviceKey, { Prefer: "return=representation" }),
        body: JSON.stringify(blog),
      },
    );
    return rows[0];
  }

  if (existingRows.length) {
    const originalSlug = blog.slug;
    blog.slug = await findUniqueSlug({ baseUrl, serviceKey, blogsTable, slug: blog.slug });
    console.log(`Slug collision in DB: "${originalSlug}" already exists → using "${blog.slug}"`);
  }

  const rows = await request(restUrl(baseUrl, blogsTable, "?select=id,slug,title"), {
    method: "POST",
    headers: headers(serviceKey, { Prefer: "return=representation" }),
    body: JSON.stringify([blog]),
  });
  return rows[0];
}

async function findHashtag({ baseUrl, serviceKey, hashtagsTable, name }) {
  const query = `?name=eq.${encodeURIComponent(name)}&select=id,name&limit=1`;
  const rows = await request(restUrl(baseUrl, hashtagsTable, query), {
    method: "GET",
    headers: headers(serviceKey),
  });
  return rows[0] || null;
}

async function createHashtag({ baseUrl, serviceKey, hashtagsTable, name }) {
  const rows = await request(restUrl(baseUrl, hashtagsTable, "?select=id,name"), {
    method: "POST",
    headers: headers(serviceKey, { Prefer: "return=representation" }),
    body: JSON.stringify([{ name }]),
  });
  return rows[0];
}

async function ensureHashtag(context, name) {
  return (await findHashtag({ ...context, name }))
    || (await createHashtag({ ...context, name }));
}

async function ensureJoin({ baseUrl, serviceKey, joinTable, blogId, hashtagId }) {
  const query = `?blog_id=eq.${encodeURIComponent(blogId)}&hashtag_id=eq.${encodeURIComponent(hashtagId)}&select=id&limit=1`;
  const existing = await request(restUrl(baseUrl, joinTable, query), {
    method: "GET",
    headers: headers(serviceKey),
  });
  if (existing.length) return existing[0];

  const rows = await request(restUrl(baseUrl, joinTable, "?select=id"), {
    method: "POST",
    headers: headers(serviceKey, { Prefer: "return=representation" }),
    body: JSON.stringify([{ blog_id: blogId, hashtag_id: hashtagId }]),
  });
  return rows[0];
}

async function main() {
  await loadEnvFile();

  const dryRun = process.argv.includes("--dry-run");
  const forceOverwrite = process.argv.includes("--force-overwrite");
  const payloadPath = process.argv
    .slice(2)
    .find((arg) => !arg.startsWith("--")) || "outputs/db-ready/development/all-posts.json";
  const payloads = JSON.parse(await readFile(payloadPath, "utf8"));
  assertMinimumPublicBodyLength(payloads);
  assertNoTemplateImagesInContent(payloads);

  if (dryRun) {
    console.log(JSON.stringify({
      mode: "dry-run",
      count: payloads.length,
      slugs: payloads.map((payload) => payload.blog.slug),
    }, null, 2));
    return;
  }

  const baseUrl = requireDreamDecoEnv("SUPABASE_URL");
  const serviceKey = requireDreamDecoEnv("SUPABASE_SERVICE_ROLE_KEY");
  const blogsTable = envValue("DREAMDECO_SUPABASE_BLOGS_TABLE", "SUPABASE_BLOGS_TABLE", DEFAULTS.blogsTable);
  const hashtagsTable = envValue("DREAMDECO_SUPABASE_HASHTAGS_TABLE", "SUPABASE_HASHTAGS_TABLE", DEFAULTS.hashtagsTable);
  const joinTable = envValue("DREAMDECO_SUPABASE_BLOG_HASHTAGS_TABLE", "SUPABASE_BLOG_HASHTAGS_TABLE", DEFAULTS.joinTable);

  const context = { baseUrl, serviceKey, blogsTable, hashtagsTable, joinTable };
  const results = [];
  for (const payload of payloads) {
    const blog = await upsertBlog({ ...context, blog: payload.blog, forceOverwrite });
    const hashtagResults = [];
    for (const name of payload.hashtags) {
      const hashtag = await ensureHashtag(context, name);
      await ensureJoin({
        ...context,
        blogId: blog.id,
        hashtagId: hashtag.id,
      });
      hashtagResults.push(hashtag.name);
    }
    results.push({ id: blog.id, slug: blog.slug, title: blog.title, hashtags: hashtagResults });
  }

  console.log(JSON.stringify({ uploaded: results.length, results }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
