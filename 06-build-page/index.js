const fsPromises = require('fs').promises;
const path = require('path');
const { mkdir, copyFile } = require('node:fs/promises');

const copyDirRecursive = async (src, dest) => {
  await mkdir(dest, { recursive: true });

  const items = await fsPromises.readdir(src, { withFileTypes: true });

  for (const item of items) {
    const fromPath = path.join(src, item.name);
    const toPath = path.join(dest, item.name);

    item.isDirectory()
      ? await copyDirRecursive(fromPath, toPath)
      : await copyFile(fromPath, toPath);
  }
};

// Global constants
const DIST_DIR_NAME = 'project-dist';
const OUTPUT_DIR = path.join(__dirname, DIST_DIR_NAME);
const FORMAT = 'utf-8';
// ===============

// Styles constants
const CSS_EXT = '.css';
const STYLES_FOLDER_NAME = 'styles';
const STYLES_FILE_NAME = 'style' + CSS_EXT;

const STYLES_DIR = path.join(__dirname, STYLES_FOLDER_NAME);
const STYLES_BUNDLE_DIR = path.join(OUTPUT_DIR, STYLES_FILE_NAME);

const bundleStyles = async () => {
  const files = await fsPromises.readdir(STYLES_DIR, { withFileTypes: true });

  const cssContents = [];

  for (const file of files) {
    const isValidCSSFile = file.isFile() && path.extname(file.name) === CSS_EXT;

    if (isValidCSSFile) {
      const filePath = path.join(STYLES_DIR, file.name);
      const fileContent = await fsPromises.readFile(filePath, FORMAT);
      cssContents.push(fileContent);
    }
  }

  const combinedCSS = cssContents.join('\n');
  await fsPromises.writeFile(STYLES_BUNDLE_DIR, combinedCSS, FORMAT);
};

// Assets constants
const ASSETS_FOLDER_NAME = 'assets';
const ASSETS_DIR = path.join(__dirname, ASSETS_FOLDER_NAME);

const copyAssets = async () => {
  const dirCopy = path.join(OUTPUT_DIR, ASSETS_FOLDER_NAME);

  await mkdir(dirCopy, { recursive: true });

  const existingFiles = await fsPromises.readdir(dirCopy, {
    withFileTypes: true,
  });

  for (const file of existingFiles) {
    const filePath = path.join(dirCopy, file.name);
    if (file.isFile()) {
      await fsPromises.unlink(filePath);
    } else if (file.isDirectory()) {
      await fsPromises.rm(filePath, { recursive: true, force: true });
    }
  }

  const files = await fsPromises.readdir(ASSETS_DIR, { withFileTypes: true });

  for (const file of files) {
    const fileDir = path.join(ASSETS_DIR, file.name);
    const destination = path.join(dirCopy, file.name);
    if (file.isFile()) {
      await copyFile(fileDir, destination);
    } else if (file.isDirectory()) {
      await copyDirRecursive(fileDir, destination);
    }
  }
};

// HTML constants
const COMPONENTS_DIR = path.join(__dirname, 'components');
const HEADER_FILE_DIR = path.join(COMPONENTS_DIR, 'header.html');
const ACTICLE_FILE_DIR = path.join(COMPONENTS_DIR, 'articles.html');
const FOOTER_FILE_DIR = path.join(COMPONENTS_DIR, 'footer.html');
const ABOUT_FILE_DIR = path.join(COMPONENTS_DIR, 'about.html');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const OUTPUT_HTML_PATH = path.join(OUTPUT_DIR, 'index.html');

async function checkFileExists(filePath) {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const getSafelyFile = async (filePath) => {
  return (await checkFileExists(filePath))
    ? fsPromises.readFile(filePath, FORMAT)
    : () => {};
};
const injectHTML = async () => {
  const dirtHTML = await fsPromises.readFile(TEMPLATE_PATH, FORMAT);
  let finalHTML = dirtHTML;

  await Promise.all([
    getSafelyFile(HEADER_FILE_DIR),
    getSafelyFile(ACTICLE_FILE_DIR),
    getSafelyFile(FOOTER_FILE_DIR),
    getSafelyFile(ABOUT_FILE_DIR),
  ]).then((data) => {
    const [headerContent, articleContent, footerContent, aboutContent] =
      data.filter((content) => typeof content === 'string');

    if (headerContent) {
      finalHTML = finalHTML.replace('{{header}}', headerContent);
    }

    if (articleContent) {
      finalHTML = finalHTML.replace('{{articles}}', articleContent);
    }

    if (footerContent) {
      finalHTML = finalHTML.replace('{{footer}}', footerContent);
    }

    if (aboutContent) {
      finalHTML = finalHTML.replace('{{about}}', aboutContent);
    }
    return Promise.resolve(true);
  });

  await fsPromises.writeFile(OUTPUT_HTML_PATH, finalHTML, FORMAT);
};

(async () => {
  try {
    await fsPromises.rm(OUTPUT_DIR, { recursive: true, force: true });
    await fsPromises.mkdir(OUTPUT_DIR, { recursive: true });

    await bundleStyles();
    await copyAssets();
    await injectHTML();
  } catch (error) {
    console.error('Error:', error);
  }
})();
