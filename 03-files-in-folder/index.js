const fs = require('fs');
const path = require('path');

const targetDirectory = path.join(__dirname, 'secret-folder');

fs.readdir(targetDirectory, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  const transformToFileInfo = (name, ext, size) => {
    return `${name.replace(ext, '')} - ${ext.replace('.', '')} - ${
      size / 1024 + 'kb'
    }`;
  };

  files.forEach((file) => {
    if (file.isDirectory()) return;

    const fileName = file.name;

    const joinedFilePath = path.normalize(
      path.join(targetDirectory, file.name),
    );
    const fileExt = path.extname(joinedFilePath);

    fs.stat(joinedFilePath, {}, (err, file) => {
      console.log(transformToFileInfo(fileName, fileExt, file.size));
    });
  });
});
