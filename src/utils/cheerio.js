const axios = require('axios');
const cheerio = require('cheerio');

const loadContent = async (url) => {
  const page = await axios.get(url);

  return cheerio.load(page.data);
}

module.exports = {
  loadContent
}
