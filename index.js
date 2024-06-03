// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { Locator } = require("playwright");
const fs = require("fs");
const path = require("path");
const csvWriter = require("csv-writer").createObjectCsvWriter;

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com");

  // get top 10 article titles and their url
  // save top 10 to csv
  // Define locators for the article rows, rank, title, and URL elements
  const rows = page.locator(".athing");
  // console.log(await rows.textContent());
  const totalNumberOfRows = await rows.count();
  let result = [];
  for (let i = 0; i < totalNumberOfRows; i++) {
    if (result.length >= 10) break;
    // check rank of row, where 1 <= rank <= 10
    myRow = rows.nth(i);
    // console.log(await myRow.textContent());
    const rank = myRow.locator(".rank");
    const myRank = await rank.textContent();
    if (myRank <= 10 && myRank >= 1) {
      // save results since it is a top 10 one
      const title = await myRow.locator(".titleline").textContent();
      // console.log(await title.textContent());
      // if href is internal link then it doesnt give full url
      const url = await myRow
        .locator(".titleline > a")
        .first()
        .getAttribute("href");
      // console.log(url);
      result.push({ title, url, rank: myRank.split(".")[0] });
    }
  }
  console.log(result);

  const csvPath = path.join(__dirname, "hacker_news_top_10.csv");
  const writer = csvWriter({
    path: csvPath,
    header: [
      { id: "rank", title: "Rank" },
      { id: "title", title: "Title" },
      { id: "url", title: "URL" },
    ],
  });
  await writer.writeRecords(result);
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
