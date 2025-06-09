const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // use headless: false to see browser
  const page = await browser.newPage();

  // Set user-agent to reduce chances of bot detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  // Go to Glassdoor search result page
  const url = 'https://www.glassdoor.co.in/Job/india-developer-jobs-SRCH_IL.0,5_IN115_KO6,15.htm';
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for job listings to appear
  await page.waitForSelector('li[data-test="jobListing"]');

  // Scrape data
  const jobs = await page.$$eval('li[data-test="jobListing"]', jobEls => {
    return jobEls.map(job => {
      const title = job.querySelector('a[data-test="job-title"]')?.innerText || '';
      const company = job.querySelector('.EmployerProfile_compactEmployerName__9MGcV')?.innerText || '';
      const location = job.querySelector('[data-test="emp-location"]')?.innerText || '';
      const desc = job.querySelector('[data-test="descSnippet"]')?.innerText || '';
      const link = job.querySelector('a[data-test="job-title"]')?.href || '';

      return { title, company, location, desc, link };
    });
  });

  console.log(jobs);

  // Save to file
  fs.writeFileSync('glassdoor_jobs.json', JSON.stringify(jobs, null, 2));

  await browser.close();
})();
