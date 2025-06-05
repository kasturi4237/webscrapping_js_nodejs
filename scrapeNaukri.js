const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  console.log('Navigating to Naukri...');
  await page.goto('https://www.naukri.com/software-developer-jobs', {
    waitUntil: 'networkidle2',
    timeout: 0,
  });

  console.log('Waiting for job listings...');
  await page.waitForSelector('div.cust-job-tuple', { timeout: 60000 });

  const jobs = await page.evaluate(() => {
    const jobCards = document.querySelectorAll('div.cust-job-tuple');
    const data = [];

    jobCards.forEach(card => {
      const jobTitle = card.querySelector('a.title')?.innerText.trim();
      const company = card.querySelector('.comp-name')?.innerText.trim();
      const location = card.querySelector('.location')?.innerText.trim();
      const description = card.querySelector('.job-description')?.innerText.trim() || '';

      if (jobTitle && company) {
        data.push({ jobTitle, company, location, description });
      }
    });

    return data;
  });

  fs.writeFileSync('naukri-jobs.json', JSON.stringify(jobs, null, 2));
  console.log(`✅ ${jobs.length} Jobs saved to naukri-jobs.json`);

  await browser.close();
})();

