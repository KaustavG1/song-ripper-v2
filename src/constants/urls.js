// import os from 'os';
const os = require('node:os');

const filePathForMac = '/Users/kaustav/Music/SongRipperV2/'; // For Mac OS
const filePathForLinux = '/home/kaustav/Music/SongRipperV2/'; // For Linux

const filePath = os.platform() === 'linux' ? filePathForLinux : filePathForMac;
const yearsUrl = 'https://pagalfree.com/category/Bollywood.html';
const getYearUrl = (year, page = 0) => `https://pagalfree.com/category/Bollywood/${page}/${year}.html`

module.exports = {
  filePath,
  yearsUrl,
  getYearUrl
}
