const axios = require('axios');
const pathLib = require('node:path');
const fs = require('fs');
const cheerioLoader = require('../utils/cheerio');
const {filePath} = require('../constants/urls');
const readFromFile = require('../utils/readFromFile');
const writeToFile = require('../utils/writeToFile');

const getDownloadLinks = async (url, movieName, name) => {
  try {
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

    return [allLinks[0], ''];
  } catch (err) {
    console.log(`An error occurred while downloading ${movieName} - ${name}`);
    return ['No url', err];
  }
};

const getPath = (basePath, name) => {
  const safaName = name.replaceAll(':', '-');

  return pathLib.join(basePath, safaName);
}

const createDirectoryAndWrite = async (path, data, name, ext) => {
  try {
    await fs.accessSync(path);
  } catch {
    await fs.mkdirSync(path, {recursive: true});
  } finally {
    await fs.writeFileSync(getPath(path, `${name}.${ext}`), data);
  }
};

const downloadSong = async (highestQualityLink, movieName, name) => {
  axios.get(highestQualityLink, {
    responseType: 'arraybuffer'
  }).then(({ data }) => {
    createDirectoryAndWrite(getPath(filePath, movieName), data, name, 'mp3');
  }).catch(async (err) => {
    console.log(`An error occurred while downloading ${movieName} - ${name}`);
    await writeToFile.writeToFile(
      `${movieName} - ${name} \n An error ocurred while downloading ${highestQualityLink} \n ${err} \n`,
      './temp/FailedToDownload.txt',
      true
    );
  });
};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const downloadSongs = async (input) => {
  let data, parsedMovies;
  if (!input) {
    data = await readFromFile.readFromFile('./temp/moviesList.txt');
    parsedMovies = await JSON.parse(data);
  } else {
    parsedMovies = input;
  }

  for (movie of parsedMovies) {
    console.debug(`Starting ${movie.movie} songs download`);
    for ({song, songPageUrl, singer} of movie.songs) {
      const [{downloadUrl = ''}, err] = await getDownloadLinks(songPageUrl, movie.movie, song);
      if (downloadUrl) {
        downloadSong(downloadUrl, movie.movie, song);
      }

      if (err) {
        await writeToFile.writeToFile(
          `${movie.movie} - ${song} \n Download page not found \n ${err} \n`,
          './temp/FailedToDownload.txt',
          true
        );
      }
    }

    try {
      await createDirectoryAndWrite(getPath(filePath, movie.movie), JSON.stringify(movie), 'log', 'txt');
    } catch (err) {
      await writeToFile.writeToFile(
        `${movie.movie} - ${song} \n An error ocurred while creating directory \n ${err} \n`,
        './temp/FailedToDownload.txt',
        true
      );
    }
    console.debug(`Completed ${movie.movie} songs download`);

    await delay(100);
  }
}

module.exports = {
  downloadSongs
}
