const fs = require('fs');
const fsPromises = fs.promises;

async function readFromFile(path) {
  try {
    console.log('About to read');
    const data = await fsPromises.readFile(path, { encoding: 'utf8' });
    return data;
  } catch (err){
    console.error(err);
  }
}

module.exports = {
  readFromFile
}
