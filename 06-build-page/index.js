const fsp = require('fs').promises;
const path = require('path');

const projectDistFolderPath = path.join(__dirname, 'project-dist');

const templateFilePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const assetsFolderPath = path.join(__dirname, 'assets');

const indexHtmlFilePath = path.join(projectDistFolderPath, 'index.html');
const bundleCssFilePath = path.join(projectDistFolderPath, 'style.css');
const assetsCopyFolderPath = path.join(projectDistFolderPath, 'assets');

async function createDir() {
  await fsp.rm(projectDistFolderPath, { recursive: true, force: true });
  await fsp.mkdir(projectDistFolderPath, { recursive: true });
}

async function replaceTemplateTags() {
  let templateContent = await fsp.readFile(templateFilePath, 'utf-8');
  const componentFiles = await fsp.readdir(componentsFolderPath);

  for (const file of componentFiles) {
    if (path.extname(file) === '.html') {
      const componentName = path.basename(file, '.html');
      const componentFilePath = path.join(componentsFolderPath, file);
      const componentContent = await fsp.readFile(componentFilePath, 'utf-8');
      const tagRegex = new RegExp(`{{\\s*${componentName}\\s*}}`, 'g');

      templateContent = templateContent.replace(tagRegex, componentContent);
    }
  }
  await fsp.writeFile(indexHtmlFilePath, templateContent, 'utf-8');
}

async function mergeStyles() {
  const files = await fsp.readdir(stylesFolderPath);

  let allStylesArray = [];

  for (const file of files) {
    if (path.extname(file) === '.css') {
      const styleFilePath = path.join(stylesFolderPath, file);
      const fileStyles = await fsp.readFile(styleFilePath, 'utf-8');

      allStylesArray.push(fileStyles);
    }
  }
  const bundleFile = allStylesArray.join('\n');

  await fsp.writeFile(bundleCssFilePath, bundleFile, 'utf-8');
}

async function copyDir() {
  await fsp.mkdir(assetsCopyFolderPath, { recursive: true });
  const files = await fsp.readdir(assetsFolderPath);

  for (const file of files) {
    const sourcePath = path.join(assetsFolderPath, file);
    const destinationPath = path.join(assetsCopyFolderPath, file);

    const fileStats = await fsp.stat(sourcePath);

    if (fileStats.isFile()) {
      await fsp.copyFile(sourcePath, destinationPath);
    }

    if (fileStats.isDirectory()) {
      await copySubDir(sourcePath, destinationPath);
    }
  }
}

async function copySubDir(sourceDir, destinationDir) {
  await fsp.mkdir(destinationDir, { recursive: true });
  const files = await fsp.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);
    const fileStats = await fsp.stat(sourcePath);

    if (fileStats.isFile()) {
      await fsp.copyFile(sourcePath, destinationPath);
    }
    if (fileStats.isDirectory()) {
      await copySubDir(sourcePath, destinationPath);
    }
  }
}

async function buildPage() {
  await createDir();
  await replaceTemplateTags();
  await mergeStyles();
  await copyDir();
}

buildPage();
