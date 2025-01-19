const fsp = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFileInformation() {
  const files = await fsp.readdir(folderPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileStats = await fsp.stat(filePath);

      const fileNameWithExt = file.name;

      const fileName = fileNameWithExt.split('.')[0];
      const fileExtension = path.extname(fileNameWithExt).slice(1);
      const fileSize = fileStats.size;

      console.log(`${fileName} - ${fileExtension} - ${fileSize}b`);
    }
  }
}

displayFileInformation();
