import { readFile } from "node:fs/promises";

const PLACEHOLDER_ENV_VALUES = new Set([
  "https://your-project-id.supabase.co",
  "replace-with-local-secret",
]);

const CATEGORY_TAGS = {
  "xu-huong-noi-that-can-ho-viet-nam-2026": ["Tin tức nội thất", "Xu hướng nội thất", "Căn hộ Việt Nam"],
  "top-5-phong-cach-noi-that-mua-mua-viet-nam": ["Phong cách nội thất", "K-minimal", "Japandi"],
  "lam-moi-can-ho-studio-20-trieu": ["Ngân sách thông minh", "Căn hộ nhỏ", "Mua sắm tiết kiệm"],
  "can-ho-hai-phong-ngu-gia-dinh-tre": ["Gia đình & lối sống", "Căn hộ gia đình", "Lưu trữ thông minh"],
  "cach-dung-dreamdeco-tao-phong-khach-han-toi-gian": ["Hướng dẫn DreamDeco", "AI thiết kế nội thất", "Mô phỏng nội thất"],
  "cach-chon-sofa-tot-cho-can-ho": ["Mua sắm nội thất", "Chọn sofa", "Căn hộ nhỏ"],
};

const TAG_POOL = [
  "Tin tức nội thất",
  "Xu hướng nội thất",
  "Căn hộ Việt Nam",
  "Phong cách nội thất",
  "K-minimal",
  "Japandi",
  "Ngân sách thông minh",
  "Căn hộ nhỏ",
  "Mua sắm tiết kiệm",
  "Gia đình & lối sống",
  "Căn hộ gia đình",
  "Lưu trữ thông minh",
  "Hướng dẫn DreamDeco",
  "AI thiết kế nội thất",
  "Mô phỏng nội thất",
  "Mua sắm nội thất",
  "Chọn sofa",
];

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

function envValue(primary, fallback) {
  const value = process.env[primary] || (fallback ? process.env[fallback] : undefined);
  if (PLACEHOLDER_ENV_VALUES.has(value)) return undefined;
  return value;
}

function requireDreamDecoEnv(name) {
  const value = envValue(`DREAMDECO_${name}`, name);
  if (!value) {
    throw new Error(`Missing required environment variable: DREAMDECO_${name} (or fallback ${name})`);
  }
  return value;
}

function restUrl(baseUrl, table, query = "") {
  return `${baseUrl.replace(/\/$/, "")}/rest/v1/${table}${query}`;
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

async function findOrCreateTag(context, name) {
  const existing = await request(
    restUrl(context.baseUrl, "hashtag_blogs", `?name=eq.${encodeURIComponent(name)}&select=id,name&limit=1`),
    { method: "GET", headers: headers(context.serviceKey) },
  );
  if (existing.length) return existing[0];

  const created = await request(
    restUrl(context.baseUrl, "hashtag_blogs", "?select=id,name"),
    {
      method: "POST",
      headers: headers(context.serviceKey, { Prefer: "return=representation" }),
      body: JSON.stringify([{ name }]),
    },
  );
  return created[0];
}

async function main() {
  await loadEnvFile();

  const context = {
    baseUrl: requireDreamDecoEnv("SUPABASE_URL"),
    serviceKey: requireDreamDecoEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
  const slugs = Object.keys(CATEGORY_TAGS);
  const blogs = await request(
    restUrl(context.baseUrl, "blogs", `?slug=in.(${slugs.join(",")})&select=id,slug,title`),
    { method: "GET", headers: headers(context.serviceKey) },
  );

  for (const tagName of TAG_POOL) {
    await findOrCreateTag(context, tagName);
  }

  const blogIds = blogs.map((blog) => blog.id);
  if (blogIds.length) {
    await request(
      restUrl(context.baseUrl, "blog_hashtag_blogs", `?blog_id=in.(${blogIds.join(",")})`),
      { method: "DELETE", headers: headers(context.serviceKey) },
    );
  }

  const results = [];
  for (const blog of blogs) {
    const tagNames = CATEGORY_TAGS[blog.slug].slice(0, 3);
    const applied = [];
    for (const tagName of tagNames) {
      const tag = await findOrCreateTag(context, tagName);
      await request(
        restUrl(context.baseUrl, "blog_hashtag_blogs", "?select=id"),
        {
          method: "POST",
          headers: headers(context.serviceKey, { Prefer: "return=representation" }),
          body: JSON.stringify([{ blog_id: blog.id, hashtag_id: tag.id }]),
        },
      );
      applied.push(tag.name);
    }
    results.push({ slug: blog.slug, title: blog.title, tags: applied });
  }

  console.log(JSON.stringify({ tag_pool_size: TAG_POOL.length, updated: results.length, results }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
