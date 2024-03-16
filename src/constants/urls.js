// import os from 'os';
const os = require('node:os');
const path = require('node:path');

const platform = os.platform()

const filePathForWin = path.join('D:\\', 'test'); // For Windows
const filePathForMac = '/Users/kaustav/Music/SongRipperV2/'; // For Mac OS
const filePathForLinux = '/home/kaustav/Music/SongRipperV2/'; // For Linux

let filePath;

if (platform === 'linux') {
  filePath = filePathForLinux;
} else if (platform === 'win32') {
  filePath = filePathForWin;
} else {
  filePathForMac
}

const yearsUrl = 'https://pagalfree.com/category/Bollywood.html';
const getYearUrl = (year, page = 0) => `https://pagalfree.com/category/Bollywood/${page}/${year}.html`

module.exports = {
  filePath,
  yearsUrl,
  getYearUrl
}
