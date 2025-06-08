const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new", // Use new headless mode to avoid deprecation
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto("https://www.iimjobs.com/k/it-consulting-jobs", {
    waitUntil: "networkidle2"
  });

  // Wait for job cards to load by targeting a reliable element
  await page.waitForSelector('[data-testid="job_title"]');

  const jobs = await page.evaluate(() => {
    const jobCards = document.querySelectorAll('[data-testid="job_title"]');
    const jobList = [];

    jobCards.forEach(card => {
      const jobTitle = card.innerText.trim() || "N/A";
      const jobBox = card.closest(".MuiPaper-root");

      const location = jobBox?.querySelector('[data-testid="job_location"]')?.innerText.trim() || "N/A";
      const experience = jobBox?.querySelector('[data-testid="job_experience"]')?.innerText.trim() || "N/A";
      const posted = jobBox?.querySelector('[data-testid="date_posted"]')?.innerText.trim() || "N/A";

      jobList.push({ title: jobTitle, experience, location, posted });
    });

    return jobList;
  });

  fs.writeFileSync("jobs.json", JSON.stringify(jobs, null, 2));
  console.log(`✅ Scraped ${jobs.length} jobs and saved to jobs.json`);

  await browser.close();
})();
