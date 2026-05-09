const fs = require('fs');
const path = require('path');
const fm = require('hexo-front-matter');

const CLIPPINGS_DIR = 'Clippings';

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

const mdFiles = findMdFiles(CLIPPINGS_DIR);

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const result = fm.parse(content);
  console.log('===', path.basename(file), '===');
  console.log('Keys:', Object.keys(result));
  console.log('Data:', JSON.stringify(result, null, 2).substring(0, 500));
  console.log('');
}