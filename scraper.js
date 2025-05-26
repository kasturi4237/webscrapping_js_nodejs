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
