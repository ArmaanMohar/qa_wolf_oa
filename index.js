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
  const table = await page.locator("table ").nth(2).allInnerTexts();
  // console.log(table);

  // get top 10 article titles and their url in hashmap where key = url and value is title
  // save top 10 to csv
  // Define locators for the article rows, rank, title, and URL elements
  const rows = page.locator(".athing");
  // console.log(await rows.textContent());
  const totalNumberOfRows = await rows.count();
  let result = [];
  for (let i = 0; i < totalNumberOfRows; i++) {
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
      result.push({ title, url, rank: myRank });
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

  // Define locators for the main table body and its third row
  // const mainTableBodyLocator = page.locator("#hnmain > tbody");
  // const thirdRowLocator = mainTableBodyLocator.locator("tr:nth-child(3)");

  // // console.log(await thirdRowLocator.allInnerTexts());
  // // Extract the article rows from the third row
  // const articleRowsLocator = thirdRowLocator.locator(".athing");
  // const articleRowsCount = await articleRowsLocator.count();

  // // Extract the titles and URLs of the top 10 articles using locators
  // const articles = [];
  // for (let i = 0; i < 10; i++) {
  //   const rankElementLocator = thirdRowLocator.locator(
  //     `tr:nth-child(${i + 1}) td.title .rank`
  //   );

  //   const rankElement = await rankElementLocator.innerText();
  //   const rank = rankElement ? rankElement.trim() : null;
  //   if (rank && rank === `${i + 1}.`) {
  //     const titleElementLocator = thirdRowLocator.locator(
  //       `tr:nth-child(${i + 1}) td.title .titleline`
  //     );
  //     const titleElement = await titleElementLocator.innerText("a");
  //     const title = titleElement ? titleElement.trim() : "";
  //     console.log(title);

  //     const urlElementLocator = thirdRowLocator
  //       .locator(`tr:nth-child(${i + 1}) td.title .titleline `)
  //       .getByRole("link")
  //       .first();
  //     const urlElement = await urlElementLocator.getAttribute("href");
  //     const url = urlElement ? urlElement.trim() : "";
  //     console.log({ rank, title, url });

  //     articles.push({ rank, title, url });
  //   }
  // }
  // console.log(articles);
  // close browser
  await browser.close();
}

(async () => {
  await saveHackerNewsArticles();
})();
