const fsp = require('fs').promises;
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const projectDistFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(projectDistFolderPath, 'bundle.css');

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

  await fsp.writeFile(bundleFilePath, bundleFile, 'utf-8');
}

mergeStyles();
