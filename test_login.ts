import { getCaptcha, loginAndFetchSemesters } from './server/scraper/scraper.js';

async function run() {
  try {
    console.log("Fetching captcha...");
    const captcha = await getCaptcha();
    console.log("Captcha fetched!", captcha.captchaImage.substring(0, 50));
  } catch (e) {
    console.error("Error fetching captcha:", e);
  }
}
run();
