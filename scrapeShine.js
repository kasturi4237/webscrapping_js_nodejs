const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const query = 'developer'; // you can customize this
  const url = `https://www.shine.com/job-search/${query}-jobs`;

  await page.goto(url, { waitUntil: 'networkidle2' });

  const jobs = await page.evaluate(() => {
    const jobCards = document.querySelectorAll('.jobCardNova_bigCard__W2xn3');
    const jobData = [];

    jobCards.forEach(card => {
      const title = card.querySelector('p.jobCardNova_bigCardTopTitleHeading__Rj2sC a')?.innerText.trim();
      const company = card.querySelector('span.jobCardNova_bigCardTopTitleName__M_W_m')?.innerText.trim();
      const experience = card.querySelector('span.jobCardNova_bigCardCenterListExp__KTSEc')?.innerText.trim();
      const location = card.querySelector('.jobCardNova_bigCardCenterListLoc__usiPB span')?.innerText.trim();
      const url = card.querySelector('meta[itemprop="url"]')?.getAttribute('content');
      const posted = card.querySelector('span.jobApplyBtnNova_days__yODJj')?.innerText.trim();

      const skillElements = card.querySelectorAll('ul.jobCardNova_skillsLists__7YifX li');
      const skills = Array.from(skillElements).map(el => el.innerText.trim()).filter(Boolean);

      jobData.push({ title, company, experience, location, skills, url, posted });
    });

    return jobData;
  });

  console.log(jobs);
  await browser.close();
})();
