import * as fs from 'fs';
import * as path from 'path';

const scraperFile = path.join(process.cwd(), 'server', 'scraper', 'scraper.ts');
let content = fs.readFileSync(scraperFile, 'utf-8');

const targetStr = `const isLoginForm = /LoginForm\\[username\\]/.test(loginText) || /loginFormCaptcha-image/.test(loginText);`;

if (!content.includes(targetStr)) {
    console.log("Could not find targetStr");
    process.exit(1);
}

const authenticatedSessionStr = `const authenticatedSession: ScraperSession = {`;
const endIndex = content.indexOf(authenticatedSessionStr);

if (endIndex === -1) {
    console.log("Could not find authenticatedSessionStr");
    process.exit(1);
}

const replacement = `
  const attendanceRes = await fetchWithJar(ATTENDANCE_URL, jar, {
    extraHeaders: { Referer: LOGIN_URL },
  });
  const attendanceHtml = await attendanceRes.text();

  const isLoginForm =
    /LoginForm\\[username\\]/.test(attendanceHtml) ||
    /loginFormCaptcha-image/.test(attendanceHtml) ||
    attendanceHtml.includes('site/login') ||
    attendanceHtml.includes('action="/index.php?r=site%2Flogin"');

  const authenticated = !isLoginForm;

  if (!authenticated) {
    const isCaptchaError = /incorrect verification code/i.test(loginText) || /captcha/i.test(loginText);
    if (isCaptchaError) {
      throw new Error('Incorrect Captcha / verification code.');
    }
    
    // Check for user access token bug
    const crashBody = (loginText || '').toLowerCase();
    const harvested = jar['kl_erp_device_id'];
    const isTokenCrash = /unknown property|useraccesstoken|yiisoft|exception/.test(crashBody);
    
    if (isTokenCrash && harvested) {
      return {
        success: false,
        needsCaptchaRetry: true,
        deviceId: harvested,
        message: 'First-time device setup with the ERP — please enter the new captcha once more to finish signing in.',
        session: { ...session, cookies: jarToArray(jar), csrfToken: session.csrfToken },
        csrfToken: session.csrfToken,
        academicYears: [],
        semesters: [],
      };
    }
    
    throw new Error('Invalid Username or Password (or session expired immediately).');
  }

  let studentName = 'Student';
  const $ = cheerio.load(attendanceHtml);

  const nameMatch = attendanceHtml.match(/Welcome\\s+\\d+\\s+-\\s+([^<]+)/i);
  if (nameMatch && nameMatch[1]) {
    studentName = nameMatch[1].trim();
  } else {
    const userMenuText = $('.navbar-custom-menu .user-menu span.hidden-xs').text().trim();
    if (userMenuText) {
      studentName = userMenuText.replace(/^\\d+\\s*-\\s*/, '').trim();
    } else {
      const possibleName = $('.student-name, .user-name').first().text().trim();
      if (possibleName) studentName = possibleName;
    }
  }

  studentName = studentName.split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const csrfTokenMatch = attendanceHtml.match(/name="_csrf"[^>]*value="([^"]+)"/);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : session.csrfToken;
  
  `;

const before = content.slice(0, content.indexOf(targetStr));
const after = content.slice(endIndex);

fs.writeFileSync(scraperFile, before + replacement + after);
console.log("Successfully patched scraper.ts");
