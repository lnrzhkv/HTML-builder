const fs = require('fs').promises;
const path = require('path');

const TARGET_DIR = path.join(__dirname, 'styles');
const OUTPUT_DIR = path.join(__dirname, 'project-dist');
const BUNDLE_FILE_DIR = path.join(OUTPUT_DIR, 'bundle.css');

(async function bundleStyles() {
  const files = await fs.readdir(TARGET_DIR, { withFileTypes: true });

  const cssContents = [];

  for (const file of files) {
    const isValidCSSFile = file.isFile() && path.extname(file.name) === '.css';

    if (isValidCSSFile) {
      const filePath = path.join(TARGET_DIR, file.name);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      cssContents.push(fileContent);
    }
  }

  const combinedCSS = cssContents.join('\n');
  await fs.writeFile(BUNDLE_FILE_DIR, combinedCSS, 'utf-8');
})();
