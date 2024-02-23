const fs = require('fs');
const fsPromises = fs.promises;

async function writeToFile(text, path, append) {
  try {
    console.log('About to write');
    if (append) {
      fsPromises.appendFile(path, text);
    } else {
      fsPromises.writeFile(path, text);
    }
  } catch (err){
    console.error(err);
  }
}

module.exports = {
  writeToFile
}
