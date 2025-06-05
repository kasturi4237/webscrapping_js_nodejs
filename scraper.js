const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs'); // File system module

const URL = 'https://quotes.toscrape.com';

async function scrapeWebsite() {
  try {
    const response = await axios.get(URL);
    const html = response.data;
    const $ = cheerio.load(html);

    const quotes = [];

    $('.quote').each((index, element) => {
      const quoteText = $(element).find('.text').text();
      const author = $(element).find('.author').text();
      quotes.push({ quoteText, author });
    });

    // Save data to a JSON file
    fs.writeFileSync('quotes.json', JSON.stringify(quotes, null, 2));
    console.log('✅ Quotes saved to quotes.json');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

scrapeWebsite();

const fs = require('fs');

const URL = 'https://remoteok.com/remote-dev-jobs';

async function scrapeJobs() {
  try {
    const { data } = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(data);
    const jobs = [];

    $('tr.job').each((i, elem) => {
      const jobTitle = $(elem).find('h2').text().trim();
      const company = $(elem).find('.companyLink h3').text().trim();
      const location = $(elem).find('.location').text().trim() || 'Remote';
      const description = $(elem).find('.description').text().trim();

      if (jobTitle) {
        jobs.push({ jobTitle, company, location, description });
      }
    });

    fs.writeFileSync('jobs.json', JSON.stringify(jobs, null, 2));
    console.log('✅ Jobs saved to jobs.json');
  } catch (err) {
    console.error('❌ Error scraping:', err.message);
  }
}

scrapeJobs();
