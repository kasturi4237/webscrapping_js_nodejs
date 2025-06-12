const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const scrapeTimesJobs = async (keyword = "developer", location = "Bangalore") => {
  const url = `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=${keyword}&txtLocation=${location}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const jobs = [];

    $(".job-bx").each((index, element) => {
      const jobTitle = $(element).find("h2 a").text().trim();
      const company = $(element).find(".company-name span").text().trim();
      const experience = $(element).find("ul li").first().text().trim();
      const location = $(element).find(".loc span").text().trim();
      const posted = $(element).find(".sim-posted span").text().trim();
      const jobLink = $(element).find("h2 a").attr("href"); // ✅ Extract job link

      if (jobTitle) {
        jobs.push({
          jobTitle,
          company,
          experience,
          location,
          posted,
          jobLink,
        });
      }
    });

    if (jobs.length === 0) {
      console.log("⚠️ No jobs found. Try different keywords or inspect structure.");
    } else {
      console.log(`✅ Scraped ${jobs.length} jobs`);
    }

    fs.writeFileSync("timesjobs.json", JSON.stringify(jobs, null, 2), "utf-8");
    console.log("📄 Saved to timesjobs.json");

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
};

scrapeTimesJobs("oracle", "UK");
