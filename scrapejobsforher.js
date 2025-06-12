const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeJobsForHer(keyword = '', location = '') {
  const query = [];
  if (keyword) query.push(`search=${encodeURIComponent(keyword)}`);
  if (location) query.push(`location=${encodeURIComponent(location)}`);
  const url = `https://jobsforher.com/jobs?${query.join('&')}`;

  const browser = await puppeteer.launch({
    headless: 'new', // Use the new headless mode
    defaultViewport: null
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
  );

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for job cards to be visible
  await page.waitForSelector('[data-test-id="job-details"]', { timeout: 60000 });

  const jobs = await page.$$eval('[data-test-id="job-details"]', cards =>
    cards.map(card => ({
      title: card.querySelector('[data-test-id="job-title"]')?.innerText.trim() || null,
      company: card.querySelector('[data-test-id="company-name"]')?.innerText.trim() || null,
      location: card.querySelector('[data-test-id="location"]')?.innerText.trim() || null,
      link: card.querySelector('a')?.href || null
    }))
  );

  console.log(`✅ Scraped ${jobs.length} jobs`);
  fs.writeFileSync('jobsforher_jobs.json', JSON.stringify(jobs, null, 2));
  await browser.close();
}

// Run with example parameters
scrapeJobsForHer('developer', 'Delhi');

