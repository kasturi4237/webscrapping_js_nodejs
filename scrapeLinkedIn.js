const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set headless to false for debugging
  const page = await browser.newPage();

  console.log("Navigating to LinkedIn...");
  await page.goto('https://www.linkedin.com/jobs/search/?keywords=web%20developer&location=India', {
    waitUntil: 'networkidle2',
  });

  // Wait for job cards to appear
  await page.waitForSelector('.jobs-search__results-list li', { timeout: 15000 });

  const jobs = await page.evaluate(() => {
    const jobCards = document.querySelectorAll('.jobs-search__results-list li');
    const jobList = [];

    jobCards.forEach(card => {
      const title = card.querySelector('h3')?.innerText.trim();
      const company = card.querySelector('h4')?.innerText.trim();
      const location = card.querySelector('.job-search-card__location')?.innerText.trim();
      const link = card.querySelector('a')?.href;

      if (title && company && location && link) {
        jobList.push({ title, company, location, link });
      }
    });

    return jobList;
  });

  fs.writeFileSync('linkedin-jobs.json', JSON.stringify(jobs, null, 2));
  console.log(`✅ Saved ${jobs.length} jobs to linkedin-jobs.json`);

  await browser.close();
})();
