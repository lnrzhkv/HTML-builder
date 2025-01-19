const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { mkdir, copyFile } = require('node:fs/promises');

const TARGET_FOLDER_NAME = 'files';
const COPY_FOLDER_NAME = TARGET_FOLDER_NAME.concat('-copy');

(async () => {
  const dir = path.join(__dirname, TARGET_FOLDER_NAME);
  const dirCopy = path.join(__dirname, COPY_FOLDER_NAME);

  fs.access(dirCopy, (err) => {
    if (!err) {
      fs.readdir(dirCopy, (err, files) => {
        files.forEach((file) => {
          fs.unlink(path.join(dirCopy, file), (err) => {
            if (err) throw err;
          });
        });
      });
    }

    mkdir(dirCopy, { recursive: true });

    fsPromises.readdir(dir, { withFileTypes: true }).then((files) => {
      files.forEach((file) => {
        const fileDir = path.join(dir, file.name);
        const destination = path.join(dirCopy, file.name);
        copyFile(fileDir, destination);
      });
    });
  });
})();
