const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36'
  );

  const url = 'https://www.indeed.com/jobs?q=frontend+developer&l=Remote';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('div.job_seen_beacon', { timeout: 10000 });

  const jobs = await page.evaluate(() => {
    const listings = Array.from(document.querySelectorAll('div.job_seen_beacon'));
    return listings.map(listing => {
      const title = listing.querySelector('h2.jobTitle span[title]')?.innerText || '';
      const company = listing.querySelector('span[data-testid="company-name"]')?.innerText || '';
      const location = listing.querySelector('div[data-testid="text-location"]')?.innerText || '';
      const href = listing.querySelector('h2.jobTitle a')?.getAttribute('href') || '';
      const link = href ? `https://www.indeed.com${href}` : '';
      return { title, company, location, link };
    });
  });

  console.log(jobs);
  await browser.close();
})();
