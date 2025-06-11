const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.freshersworld.com/jobs';

(async () => {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const jobs = [];

    $('.job-container').each((_, element) => {
      const jobEl = $(element);

      const jobTitle = jobEl.find('.job-new-title .seo_title').text().trim();
      const companyName = jobEl.find('.latest-jobs-title').text().trim();
      const location = jobEl.find('.job-location a').text().trim();
      const experience = jobEl.find('.experience').text().trim();
      const qualifications = jobEl.find('.qualifications .elig_pos').map((i, el) => $(el).text()).get().join(', ');
      const posted = jobEl.find('.job_posted_on').next().text().trim();
      const jobLink = jobEl.attr('job_display_url');

      if (jobTitle && companyName) {
        jobs.push({
          jobTitle,
          companyName,
          location,
          experience,
          qualifications,
          posted,
          jobLink
        });
      }
    });

    // Save to JSON file
    fs.writeFileSync('freshersworld_jobs.json', JSON.stringify(jobs, null, 2), 'utf-8');
    console.log('✅ Jobs saved to freshersworld_jobs.json');
  } catch (err) {
    console.error('❌ Error scraping:', err.message);
  }
})();
