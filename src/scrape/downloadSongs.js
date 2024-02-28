const axios = require('axios');
const fs = require('fs');
const cheerioLoader = require('../utils/cheerio');
const {filePath} = require('../constants/urls');
const readFromFile = require('../utils/readFromFile');
const writeToFile = require('../utils/writeToFile');

const getDownloadLinks = async (url) => {
  const $ = await cheerioLoader.loadContent(url);

  const allLinks = [];

  $('#album_page > .album_page_content + .main_page_category_div + div > div > a').each((i, o) => {
    const downloadUrl = $(o).prop('href');
    const [bitrate] = $(o).text().trim().split(' ');

    allLinks.push({
      bitrate,
      downloadUrl
    });
  });

  allLinks.sort((a, b) => {
    if (Number(a.bitrate) > Number(b.bitrate)) {
      return -1;
    }

    return 1;
  });

  return allLinks[0];
};

const createDirectoryAndWrite = async (path, data, name, ext) => {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdirSync(path, {recursive: true});
  } finally {
    await fs.writeFileSync(`${path}/${name}.${ext}`, data);
  }
};

const downloadSong = async (highestQualityLink, movieName, name) => {
  axios.get(highestQualityLink, {
    responseType: 'arraybuffer'
  }).then(({ data }) => {
    createDirectoryAndWrite(`${filePath}${movieName}`, data, name, 'mp3');
  }).catch(async (err) => {
    console.error(err);
    await writeToFile.writeToFile(
      `${movieName} - ${name} \n An error ocurred while downloading ${highestQualityLink} \n`,
      './temp/FailedToDownload.txt',
      true
    );
  });
};

const downloadSongs = async (input) => {
  let data, parsedMovies;
  if (!input) {
    data = await readFromFile.readFromFile('./temp/moviesList.txt');
    parsedMovies = await JSON.parse(data);
  } else {
    parsedMovies = input;
  }

  for (movie of parsedMovies) {
    for ({song, songPageUrl, singer} of movie.songs) {
      const {downloadUrl} = await getDownloadLinks(songPageUrl);
      downloadSong(downloadUrl, movie.movie, song);
    }

    await createDirectoryAndWrite(`${filePath}${movie.movie}`, JSON.stringify(movie), 'log', 'txt');
  }
}

module.exports = {
  downloadSongs
}
