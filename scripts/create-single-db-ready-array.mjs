import fs from 'node:fs';

const slug = process.argv[2];
if (!slug) {
  throw new Error('Usage: node scripts/create-single-db-ready-array.mjs <slug>');
}

const inputPath = `outputs/db-ready/development/${slug}.json`;
const outputPath = `outputs/db-ready/development/${slug}-only.json`;
const payload = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
fs.writeFileSync(outputPath, JSON.stringify([payload], null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ slug, outputPath }, null, 2));
