const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(appDir);
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace if (db) { with if (db && typeof window !== 'undefined') {
  if (content.includes('if (db) {')) {
    content = content.replaceAll('if (db) {', "if (db && typeof window !== 'undefined') {");
    changed = true;
  }

  // Ensure loadData only saves when window is defined
  if (content.includes('const def = defaultData();\n        saveData(def);')) {
    content = content.replace(
      'const def = defaultData();\n        saveData(def);',
      "const def = defaultData();\n        if (typeof window !== 'undefined') { saveData(def); }"
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`Successfully patched ${modifiedCount} files for SSR & build resilience.`);
