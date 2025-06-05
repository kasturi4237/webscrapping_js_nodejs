const puppeteer = require('puppeteer');

async function scrapeWorkIndiaJobs() {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.workindia.in/jobs/', {
      waitUntil: 'networkidle2',
      timeout: 0
    });

    await page.waitForSelector('.JobItemV2');

    const jobs = await page.evaluate(() => {
      const jobCards = document.querySelectorAll('.JobItemV2');
      const jobList = [];

      jobCards.forEach(card => {
        const title = card.querySelector('h2.text-brand a')?.innerText.trim() || '';
        const salary = card.querySelector('.f14.f-bold')?.innerText.trim() || '';
        const location = card.querySelector('.JobDetail.LocationDetail')?.innerText.trim() || '';
        const jobType = card.querySelector('.JobDetail.JobTypeDetail')?.innerText.trim() || '';
        const experience = card.querySelector('.JobDetail.ExperienceDetail')?.innerText.trim() || '';
        const company = card.querySelector('.JobDetail.CompanyDetail')?.innerText.trim() || '';
        const qualification = card.querySelector('.JobDetail.QualificationDetail')?.innerText.trim() || '';
        const postedOn = card.querySelector('.JobDetail.JobPostedOnDetail')?.innerText.trim() || '';

        jobList.push({
          title,
          salary,
          location,
          jobType,
          experience,
          company,
          qualification,
          postedOn
        });
      });

      return jobList;
    });

    console.log(jobs);
  } catch (error) {
    console.error("Error scraping WorkIndia:", error.message);
  } finally {
    await browser.close();
  }
}

scrapeWorkIndiaJobs();
