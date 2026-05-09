const fs = require('fs');
const path = require('path');
const fm = require('hexo-front-matter');

const CLIPPINGS_DIR = 'Clippings';
const OUTPUT_DIR = 'public';

// Find all md files recursively
function findMdFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Parse front matter - fixed accessing
function parseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const result = fm.parse(content);
  return result;
}

// Get tag from folder name
function getTagFromPath(filePath) {
  const relPath = path.relative(CLIPPINGS_DIR, filePath);
  const parts = relPath.split(path.sep);
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] && parts[i].endsWith('.md') === false) {
      return parts[i];
    }
  }
  return 'Default';
}

// Main
const mdFiles = findMdFiles(CLIPPINGS_DIR);
console.log(`Found ${mdFiles.length} markdown files`);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

for (const file of mdFiles) {
  try {
    const parsed = parseFile(file);
    const tag = getTagFromPath(file);
    const data = parsed._ || parsed.frontMatter || {};
    console.log(`Tag: ${tag}, Title: ${data.title || 'untitled'}`);
  } catch (e) {
    console.error(`Error processing ${file}:`, e.message);
  }
}