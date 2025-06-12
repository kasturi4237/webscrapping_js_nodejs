// scrapeCutshortPuppeteer.js
const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeCutshort(keyword = 'QA', location = '') {
  const query = [];
  if (keyword) query.push(`q=${encodeURIComponent(keyword)}`);
  if (location) query.push(`l=${encodeURIComponent(location)}`);
  const url = `https://cutshort.io/search-jobs?${query.join("&")}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const jobs = await page.$$eval('div.sc-61a153a7-12', cards =>
    cards.map(card => {
      const titleEl = card.querySelector('div.sc-61a153a7-14');
      const companyEl = card.querySelector('a.sc-89b45c2f-1');
      const postedByEl = card.querySelector('div.sc-b6704a4e-0.jjlZgR');
      const job = {
        title: titleEl?.innerText.trim() || null,
        company: companyEl?.innerText.trim() || null,
        postedBy: postedByEl?.innerText.replace(/^Posted by\s*/, '').trim() || null,
      };
      const linkEl = card.querySelector('button[aria-label="Button to copy the job link"]');
      if (linkEl) {
        const clickHandler = linkEl.getAttribute('onclick');
        const urlMatch = clickHandler && clickHandler.match(/'(https:\/\/cutshort.io\/job\/[^']+)'/);
        if (urlMatch) job.link = urlMatch[1];
      }
      return job;
    })
  );

  console.log(`✅ Scraped ${jobs.length} jobs`);
  fs.writeFileSync('cutshort_puppeteer.json', JSON.stringify(jobs, null, 2));
  await browser.close();
}

scrapeCutshort('QA');

