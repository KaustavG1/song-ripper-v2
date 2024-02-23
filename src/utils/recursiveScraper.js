const cheerioLoader = require('../utils/cheerio');

const recusiveScrapeMovies = async (url, year) => {
  // Temp movie list
  let tempMovies = [];

  // Load (next) page url
  const $ = await cheerioLoader.loadContent(url);

  // Make a list of urls of movies
  $('#category_content > a').each((i, o) => {
    const movieUrl = $(o).prop('href');
    const movie = $(o).find('.heading > b').text().replaceAll('Mp3', '').replaceAll('Songs', '').trim();

    tempMovies.push({movie, movieUrl, year, yearUrl: url});
  });

  // Parse next page button
  const nextPageUrl = $('.btn-primary').filter(':contains("Next")').prop('href');

  // If next page button is available, call self with next page url, else return
  if (nextPageUrl) {
    const res = await recusiveScrapeMovies(nextPageUrl, year);
    // Add returned array to current call's temp array
    tempMovies = [...tempMovies, ...res];
  } else {
    return tempMovies;
  }

  // Return current call's temp array
  return tempMovies;
};

const recursiveScrapeSongs = async (movie) => {
  // Load song page url
  const $ = await cheerioLoader.loadContent(movie.movieUrl);

  const songList = [];

  $('#album_page > .album_page_content ~ .main_page_category_div + div > a').each((i, o) => {
    const songPageUrl = $(o).prop('href');
    const [song, singer] = $(o).text().trim().split('\n');

    songList.push({
      song: song.replaceAll('Mp3', '').replaceAll('Song', '').trim(),
      songPageUrl,
      singer: singer.trim(),
    })
  });

  // for (song of songList) {
  //   const downloadLink = await getDownloadLinks(song.songPageUrl);
  //   song.downloadLink = downloadLink;
  // }

  movie.songs = songList;
  movie.songCount = songList.length;

  return movie;
};

module.exports = {
  recusiveScrapeMovies,
  recursiveScrapeSongs
};
