const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto("https://www.foundit.in/srp/results?query=developer", {
    waitUntil: "networkidle2",
    timeout: 0
  });

  // Wait for job card container
  await page.waitForSelector(".cardContainer", { timeout: 60000 });

  // Scroll to trigger lazy loading (optional if needed)
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });

  const jobData = await page.evaluate(() => {
    const jobCards = document.querySelectorAll(".cardContainer");
    const jobs = [];

    jobCards.forEach((card) => {
      const title = card.querySelector(".jobTitle")?.innerText?.trim() || '';
      const company = card.querySelector(".companyName p")?.innerText?.trim() || '';
      const location = card.querySelector(".location")?.innerText?.trim() || '';
      const experience = card.querySelector(".experienceSalary .details")?.innerText?.trim() || '';
      const posted = card.querySelector(".timeText")?.innerText?.trim() || '';

      jobs.push({ title, company, location, experience, posted });
    });

    return jobs;
  });

  console.log("Scraped Jobs:\n", jobData);
  await browser.close();
})();
