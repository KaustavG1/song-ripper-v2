const scrape = require('./src/scrape/scrape');
const writeToFile = require('./src/utils/writeToFile');
const downloadSongs = require('./src/scrape/downloadSongs');

const mode = process.argv[2]

const initialize = async () => {
  if (!mode) {
    // Make a list of all the years and year urls
    const years = await scrape.scrapeYears();
    console.log('Years scraped');

    // For each year, go to the year url, and form a list of movies
    let allMovies = await scrape.scrapeMovies(years);
    allMovies = allMovies.flat();
    console.log('Movies scraped');

    // For each movie, form the list of song page urls
    const allMoviesWithSongs = await scrape.scrapeSongs(allMovies);
    console.log('Songs scraped');

    // await writeToFile.writeToFile(
    //   JSON.stringify(allMoviesWithSongs), './temp/moviesList.txt'
    // );

    // Uncomment this to scrape and download
    // await downloadSongs.downloadSongs(allMoviesWithSongs);
  } else {
    // Go to song page url, and form list of song download url
    // Uncomment this to download
    console.log('Starting download')
    await downloadSongs.downloadSongs();
  }

};

initialize();
