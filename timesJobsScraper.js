const axios = require('axios');
const cheerio = require('cheerio');

const SEARCH_URL = `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=javascript+developer&txtLocation=`;

async function scrapeTimesJobs() {
  try {
    const { data } = await axios.get(SEARCH_URL);
    const $ = cheerio.load(data);

    const jobs = [];

    $('.job-bx').each((i, el) => {
      const jobTitle = $(el).find('h2 a').text().trim();
      const company = $(el).find('.companyName').text().trim();
      const experience = $(el).find('.experience span').text().trim();
      const location = $(el).find('.loc span').text().trim();
      const postedDate = $(el).find('.sim-posted span').text().trim();
      const detailLink = $(el).find('h2 a').attr('href');

      if (jobTitle) {
        jobs.push({ jobTitle, company, experience, location, postedDate, detailLink });
      }
    });

    console.log(JSON.stringify(jobs.slice(0, 5), null, 2)); // Show top 5 results
  } catch (error) {
    console.error('Error scraping TimesJobs:', error.message);
  }
}

scrapeTimesJobs();

