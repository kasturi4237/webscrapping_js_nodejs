const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log("Navigating to Apna...");
  await page.goto('https://apna.co/jobs/', { waitUntil: 'networkidle2' });

  // Enter search keyword
  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', 'Web Developer');
  await page.keyboard.press('Enter');

  // Wait for results to load
  await new Promise(resolve => setTimeout(resolve, 5000));
  await page.waitForSelector('[data-testid="job-card"]');

  // Scrape job listings
  const jobs = await page.evaluate(() => {
    const cards = document.querySelectorAll('[data-testid="job-card"]');
    const jobList = [];

    cards.forEach(card => {
      const title = card.querySelector('[data-testid="job-title"]')?.innerText.trim() || '';
      const company = card.querySelector('[data-testid="company-title"]')?.innerText.trim() || '';
      const location = card.querySelector('[data-testid="job-location"]')?.innerText.trim() || '';
      const salary = card.querySelector('[data-testid="job-salary"]')?.innerText.trim() || '';

      const tagElements = card.querySelectorAll('div[data-testid="job-tags-info"] p');
      const tags = Array.from(tagElements).map(p => p.innerText.trim());

      jobList.push({ title, company, location, salary, tags });
    });

    // Remove duplicates based on title + company + location
    const seen = new Set();
    const uniqueJobs = jobList.filter(job => {
      const key = `${job.title}|${job.company}|${job.location}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return uniqueJobs;
  });

  // Save to JSON file
  fs.writeFileSync('apna-jobs.json', JSON.stringify(jobs, null, 2));
  console.log(`✅ Saved ${jobs.length} unique jobs to apna-jobs.json`);

  await browser.close();
})();


