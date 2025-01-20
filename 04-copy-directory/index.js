const fsp = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fsp.rm(newFolderPath, { recursive: true, force: true });
  await fsp.mkdir(newFolderPath, { recursive: true });

  const files = await fsp.readdir(folderPath);

  for (const file of files) {
    const sourcePath = path.join(folderPath, file);
    const destinationPath = path.join(newFolderPath, file);
    await fsp.copyFile(sourcePath, destinationPath);
  }
}

copyDir();
