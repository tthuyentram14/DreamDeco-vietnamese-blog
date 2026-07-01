import fs from 'node:fs';

const slug = process.argv[2];
if (!slug) {
  throw new Error('Usage: node scripts/qa-single-blog-package.mjs <slug>');
}

const jsonPath = `outputs/final-posts/json/${slug}.json`;
const pkg = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const text = pkg.content_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const contentSrc = Array.from(pkg.content_html.matchAll(/<img[^>]+src="([^"]+)"/g)).map((m) => m[1]);
const badPatterns = [
  'Hãy cùng khám phá',
  'Hãy cùng tìm hiểu',
  'Không chỉ',
  'thực sự rất',
  'hoàn toàn mới mẻ',
  'Hy vọng bài viết',
  'Bạn đã bao giờ',
  'Vậy thì',
  'Đặc biệt hơn',
  'Tóm lại, có thể thấy'
];

const result = {
  title: pkg.title,
  title_len: [...pkg.title].length,
  meta_len: [...pkg.meta_description].length,
  slug_ok: /^[a-z0-9-]+$/.test(pkg.slug),
  category: pkg.category,
  category_ok: [
    'news_magazine',
    'global_local_styles',
    'budget_scale',
    'lifestyle_age',
    'dreamdeco_guide',
    'consumer_guide'
  ].includes(pkg.category),
  char_count: [...text].length,
  thumbnail_in_html: pkg.content_html.includes(pkg.thumbnail_image.file_path),
  content_images_in_html: pkg.content_images.map((image) => ({
    file: image.file_path,
    in_html: contentSrc.includes(image.file_path),
    exists: /^https?:\/\//.test(image.file_path) || fs.existsSync(image.file_path)
  })),
  thumbnail_exists: /^https?:\/\//.test(pkg.thumbnail_image.file_path) || fs.existsSync(pkg.thumbnail_image.file_path),
  bad_found: badPatterns.filter((pattern) => pkg.content_html.includes(pattern)),
  disclosure: pkg.content_html.includes(
    'Written by AI - Nội dung được tạo bởi AI dựa trên quá trình tổng hợp, biên tập và kiểm tra thông tin từ nhiều nguồn tham khảo.'
  )
};

console.log(JSON.stringify(result, null, 2));

const failures = [];
if (result.title_len >= 70) failures.push('title too long');
if (result.meta_len >= 160) failures.push('meta too long');
if (!result.slug_ok) failures.push('slug invalid');
if (!result.category_ok) failures.push('category invalid');
if (result.char_count < 8000) failures.push('body too short');
if (result.thumbnail_in_html) failures.push('thumbnail appears in html');
if (!result.thumbnail_exists) failures.push('thumbnail missing');
if (result.content_images_in_html.some((image) => !image.in_html || !image.exists)) failures.push('content image missing or not in html');
if (result.bad_found.length) failures.push('bad AI pattern found');
if (!result.disclosure) failures.push('AI disclosure missing');

if (failures.length) {
  console.error(JSON.stringify({ verdict: 'REVISE', failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ verdict: 'PASS', checks_passed: 9 }, null, 2));
