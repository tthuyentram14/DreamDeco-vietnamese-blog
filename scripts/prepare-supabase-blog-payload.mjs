import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const INPUT_DIR = "outputs/final-posts/json";
const OUTPUT_DIR = "outputs/db-ready/development";

function categoryToHashtag(category) {
  const map = {
    news_magazine: ["Tin tức nội thất", "Xu hướng nội thất", "Căn hộ Việt Nam"],
    global_local_styles: ["Phong cách nội thất", "K-minimal", "Japandi"],
    budget_scale: ["Ngân sách thông minh", "Căn hộ nhỏ", "Mua sắm tiết kiệm"],
    lifestyle_age: ["Gia đình & lối sống", "Căn hộ gia đình", "Lưu trữ thông minh"],
    dreamdeco_guide: ["Hướng dẫn DreamDeco", "AI thiết kế nội thất", "Mô phỏng nội thất"],
    consumer_guide: ["Mua sắm nội thất", "Chọn sofa", "Căn hộ nhỏ"],
  };
  return map[category] || [category || "DreamDeco"];
}


function escapeRegExp(value) {
  return String(value).replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
}

function basename(value) {
  return String(value || "").split(/[\\/]/).filter(Boolean).pop() || "";
}

function collectTemplateImagePaths(pkg) {
  return [
    pkg?.thumbnail_image?.file_path,
  ].filter((value) => typeof value === "string" && value.trim());
}

function isTemplateImageSrc(src, templatePaths) {
  const srcBase = basename(src);
  return templatePaths.some((templatePath) => {
    const templateBase = basename(templatePath);
    return src === templatePath || srcBase === templateBase;
  });
}

function stripTemplateImagesFromHtml(html, pkg) {
  const templatePaths = collectTemplateImagePaths(pkg);
  if (!templatePaths.length || typeof html !== "string") return html || "";

  let cleaned = html;
  const imageSrcs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
  for (const src of imageSrcs) {
    if (!isTemplateImageSrc(src, templatePaths)) continue;
    const escaped = escapeRegExp(src);
    cleaned = cleaned.replace(new RegExp("<figure\\b[^>]*>\\s*<img[^>]+src=[\"']" + escaped + "[\"'][\\s\\S]*?<\\/figure>\\s*", "gi"), "");
    cleaned = cleaned.replace(new RegExp("<p\\b[^>]*>\\s*<img[^>]+src=[\"']" + escaped + "[\"'][\\s\\S]*?<\\/p>\\s*", "gi"), "");
    cleaned = cleaned.replace(new RegExp("<img[^>]+src=[\"']" + escaped + "[\"'][^>]*>\\s*", "gi"), "");
  }
  return cleaned.trim();
}

function removeTemplateContentImages(pkg) {
  const templatePaths = collectTemplateImagePaths(pkg);
  return (pkg.content_images || []).filter((image) => !isTemplateImageSrc(image?.file_path, templatePaths));
}

function packageForDb(pkg) {
  const contentHtml = stripTemplateImagesFromHtml(pkg.content_html || "", pkg);
  return {
    ...pkg,
    content_html: contentHtml,
    content_images: removeTemplateContentImages(pkg).filter((image) => {
      const filePath = image?.file_path;
      return typeof filePath !== "string" || contentHtml.includes(filePath) || contentHtml.includes(filePath.replace("outputs/", "../../"));
    }),
  };
}

function collectHashtags(pkg) {
  return categoryToHashtag(pkg.category)
    .filter(Boolean)
    .map((tag) => String(tag).trim())
    .slice(0, 3);
}

function toBlogRow(pkg) {
  return {
    title: pkg.title || null,
    slug: pkg.slug || null,
    content: pkg.content_html || "",
    view_count: 0,
    share_count: 0,
    status: false,
    description: pkg.meta_description || pkg.excerpt || null,
  };
}

function deduplicateSlug(slug, usedSlugs) {
  if (!usedSlugs.has(slug)) {
    usedSlugs.add(slug);
    return slug;
  }
  let suffix = 2;
  while (usedSlugs.has(`${slug}-${suffix}`)) suffix++;
  const unique = `${slug}-${suffix}`;
  usedSlugs.add(unique);
  return unique;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const inputRoot = path.resolve(INPUT_DIR);
  const outputRoot = path.resolve(OUTPUT_DIR);
  const usedSlugs = new Set();
  const payloads = [];
  for (const file of await readdir(inputRoot)) {
    if (!file.endsWith(".json")) continue;
    const fullPath = path.join(inputRoot, file);
    const pkg = packageForDb(JSON.parse(await readFile(fullPath, "utf8")));
    const blog = toBlogRow(pkg);
    const originalSlug = blog.slug;
    blog.slug = deduplicateSlug(blog.slug, usedSlugs);
    if (blog.slug !== originalSlug) {
      console.log(`Slug deduplicated in batch: "${originalSlug}" → "${blog.slug}"`);
    }
    const payload = {
      source_file: fullPath,
      blog,
      hashtags: collectHashtags(pkg),
      original_package: pkg,
    };
    payloads.push(payload);
    await writeFile(
      path.join(outputRoot, file),
      `${JSON.stringify(payload, null, 2)}\n`,
      "utf8",
    );
  }

  await writeFile(
    path.join(outputRoot, "all-posts.json"),
    `${JSON.stringify(payloads, null, 2)}\n`,
    "utf8",
  );

  console.log(`Prepared ${payloads.length} Supabase blog payloads in ${outputRoot}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
