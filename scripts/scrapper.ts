import { test, expect, Page } from "@playwright/test";
import { chromium } from "playwright";
import { writeFileSync } from "fs";
import path from "path";

type Review = { rating: string; content: string };

const BASE_URL =
  "https://www.amazon.com/Meta-Quest-Pro-Oculus/product-reviews/B09Z7KGTVW/?reviewerType=all_reviews&pageNumber=";

const TIMEOUT_BETWEEN_FETCH = 1000;

async function getReviews(page: Page): Promise<Review[]> {
  const reviewsLoc = await page.locator(".review").all();
  const reviews: Review[] = [];
  for (const row of reviewsLoc) {
    const ratingLoc = row.locator(".review-rating span");
    const ratingText = await ratingLoc?.textContent();
    const rating = ratingText?.trim()[0]!;

    const descLoc = row.locator(".review-text");
    const descText = await descLoc?.textContent();
    const content = descText?.trim()!;
    reviews.push({ rating, content });
  }
  return reviews;
}

async function getReviewsCount(page: Page): Promise<number> {
  const reviewCountText = page.locator(`#filter-info-section > div`);
  await reviewCountText.waitFor();
  let reviewCountTextContent = await reviewCountText.textContent();
  if (reviewCountTextContent) {
    reviewCountTextContent = reviewCountTextContent.trim();
    const reviewCount = Number(
      reviewCountTextContent.trim().split(",")[1].split(" ")[1]
    );
    return reviewCount;
  }
  return 0;
}

function writeInFile(fileName: string, value: any) {
  try {
    const filePath = path.resolve(process.cwd(), fileName);
    writeFileSync(filePath, value, "utf8");
    console.log("*** Result stored into ", filePath);
  } catch (error) {
    console.error("Failed to write reviews to file:", error);
  }
}

(async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let allPagesReview: Review[] = [];
  await page.goto(BASE_URL + "1");
  const reviewCount = await getReviewsCount(page);
  const countPageToBrowse = reviewCount > 10 ? 10 : reviewCount;
  for (let index = 1; index <= countPageToBrowse; index++) {
    console.log("Fetching page...", index + "/" + countPageToBrowse);
    await page.goto(BASE_URL + "" + index);
    const reviews = await getReviews(page);
    console.log("Reviews found: ", reviews.length);
    allPagesReview = [...allPagesReview, ...reviews];
    await page.waitForTimeout(TIMEOUT_BETWEEN_FETCH); // Wait for 2 seconds
  }
  writeInFile("reviews.json", JSON.stringify(allPagesReview, null, 2));
  await browser.close();
})();
