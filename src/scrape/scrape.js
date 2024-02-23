const urls = require('../constants/urls');
const cheerioLoader = require('../utils/cheerio');
const recursiveScraper = require('../utils/recursiveScraper');

// Make a list of all the years and year urls
const scrapeYears = async () => {
  const years = [];
  const $ = await cheerioLoader.loadContent(urls.yearsUrl);
  $('#year > option').each((i, o) => {
    const year = $(o).val();

    // Tweak the years to restrict number of requests
    if (Number(year) > 1989 && Number(year) < 1994) {
      years.push({year, yearUrl: urls.getYearUrl(year)});
    }
  });

  return years;
};

// For each year, go to the year url, and form a list of movies
const scrapeMovies = async (years) => {
  const yearUrlList = years.map(({yearUrl, year}) => (
    recursiveScraper.recusiveScrapeMovies(yearUrl, year)
  ));

  const allMovies = await Promise.all(yearUrlList);

  return allMovies;
};

// For each movie, form the list of song page urls
const scrapeSongs = async (allMovies) => {
  // For all movies create promises and make promise.all call
  const movieUrlList = allMovies.map((movie) => (
    recursiveScraper.recursiveScrapeSongs(movie)
  ));

  const allMoviesWithSongs = await Promise.all(movieUrlList);

  return allMoviesWithSongs;
};

module.exports = {
  scrapeYears,
  scrapeMovies,
  scrapeSongs
};
