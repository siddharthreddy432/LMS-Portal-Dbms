import * as fs from "fs";
import * as cheerio from 'cheerio';
import { Agent, fetch as _undiciFetch } from 'undici';

const undiciFetch = _undiciFetch as any;
const globalAgent = new Agent({ keepAliveTimeout: 60 * 1000, keepAliveMaxTimeout: 60 * 1000, connections: 100 });
const ERP_URL = 'https://newerp.kluniversity.in';
const LOGIN_URL = `${ERP_URL}/index.php?r=site%2Flogin`;
const ATTENDANCE_URL = `${ERP_URL}/index.php?r=studentattendance%2Fstudentdailyattendance%2Fsearchgetinput`;
const TIMETABLE_URL = `${ERP_URL}/index.php?r=timetables%2Funiversitymasteracademictimetableview%2Findexstudentindisearch`;
const COURSE_LIST_URL = `${ERP_URL}/index.php?r=studentattendance%2Fstudentdailyattendance%2Fcourselist`;
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface ScraperSession {
 cookies: any[];
 csrfToken: string;
 userAgent: string;
}

type CookieJar = Record<string, string>;

function getSetCookies(res: Response): string[] {
 const anyHeaders = res.headers as any;
 if (typeof anyHeaders.getSetCookie === 'function') {
 return anyHeaders.getSetCookie();
 }
 const raw = res.headers.get('set-cookie');
 if (!raw) return [];
 return raw.split(/,(?=\s*[^=;,]+=)/);
}

function mergeSetCookies(jar: CookieJar, res: Response): void {
 for (const sc of getSetCookies(res)) {
 const firstSemi = sc.indexOf(';');
 const pair = (firstSemi > -1 ? sc.slice(0, firstSemi) : sc).trim();
 const eq = pair.indexOf('=');
 if (eq > -1) {
 const name = pair.slice(0, eq).trim();
 const value = pair.slice(eq + 1).trim();
 if (name) jar[name] = value;
 }
 }
}

function cookieHeader(jar: CookieJar): string {
 return Object.entries(jar)
 .map(([k, v]) => `${k}=${v}`)
 .join('; ');
}

function jarToArray(jar: CookieJar): { name: string; value: string }[] {
 return Object.entries(jar).map(([name, value]) => ({ name, value }));
}

function arrayToJar(cookies: { name: string; value: string }[]): CookieJar {
 const jar: CookieJar = {};
 for (const c of cookies || []) {
 if (c && c.name) jar[c.name] = c.value;
 }
 return jar;
}

async function fetchWithJar(
 url: string,
 jar: CookieJar,
 init: RequestInit & { extraHeaders?: Record<string, string> } = {},
 maxRedirects = 5
): Promise<Response> {
 let currentUrl = url;
 let method = (init.method || 'GET').toUpperCase();
 let body = init.body;
 for (let i = 0; i <= maxRedirects; i++) {
 const headers: Record<string, string> = {
 'User-Agent': USER_AGENT,
 ...(init.extraHeaders || {}),
 };
 const cookies = cookieHeader(jar);
 if (cookies) headers['Cookie'] = cookies;
 if (body && method !== 'GET' && method !== 'HEAD') {
 headers['Content-Type'] = headers['Content-Type'] || 'application/x-www-form-urlencoded';
 }
 let res;
 let attempt = 0;
 while (attempt < 2) {
 const controller = new AbortController();
 const timeoutId = setTimeout(() => controller.abort(), 15000);
 try {
 res = await undiciFetch(currentUrl, {
 signal: controller.signal,
 method,
 headers,
 body: method === 'GET' || method === 'HEAD' ? undefined : body,
 redirect: 'manual',
 dispatcher: globalAgent,
 } as RequestInit & { dispatcher: any });
 clearTimeout(timeoutId);
 break;
 } catch (e: any) {
 clearTimeout(timeoutId);
 if (e.name === 'AbortError') {
 if (attempt >= 2) throw new Error(`Request timed out after 15s: ${currentUrl}`);
 } else if (e.message && e.message.includes('fetch failed')) {
 if (attempt >= 2) throw e;
 } else {
 throw e;
 }
 }
 attempt++;
 await new Promise(r => setTimeout(r, 500));
 }
 mergeSetCookies(jar, res as Response);
 const status = (res as Response).status;
 const location = (res as Response).headers.get('location');
 if (status >= 300 && status < 400 && location) {
 await (res as Response).arrayBuffer().catch(() => {});
 let next = new URL(location, currentUrl).toString();
 next = next.replace(/^http:\/\//i, 'https://');
 currentUrl = next;
 if (status === 303 || status === 302 || status === 301) {
 method = 'GET';
 body = undefined;
 }
 continue;
 }
 return res as Response;
 }
 throw new Error('Too many redirects while contacting the ERP');
}

export interface CaptchaResponse {
 captchaImage: string;
 session: ScraperSession;
}

export async function getCaptcha(timing?: any): Promise<CaptchaResponse> {
 try {
 const jar: CookieJar = {};
 const loginRes = await fetchWithJar(LOGIN_URL, jar);
 const html = await loginRes.text();
 const $ = cheerio.load(html);
 let csrfToken = ($('input[name="_csrf"]').val() as string) || '';
 if (!csrfToken) {
 const csrfMatch = html.match(/name="_csrf"[^>]*value="([^"]+)"/);
 if (csrfMatch) csrfToken = csrfMatch[1];
 }
 if (!csrfToken) {
 throw new Error('CSRF Token not found (ERP login page structure may have changed)');
 }
 let captchaSrc = $('#loginFormCaptcha-image').attr('src');
 if (!captchaSrc) {
 const m = html.match(/id="loginFormCaptcha-image"[^>]*src="([^"]+)"/);
 if (m) captchaSrc = m[1].replace(/&amp;/g, '&');
 }
 if (!captchaSrc) {
 throw new Error('Captcha element/source not found');
 }
 const captchaUrl = new URL(captchaSrc, LOGIN_URL).toString();
 const imageRes = await fetchWithJar(captchaUrl, jar, {
 extraHeaders: { Referer: LOGIN_URL },
 });
 const imageBuffer = await imageRes.arrayBuffer();
 const captchaBase64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;
 return {
 captchaImage: captchaBase64,
 session: {
 cookies: jarToArray(jar),
 csrfToken,
 userAgent: USER_AGENT,
 },
 };
 } catch (error) {
 console.log('getCaptcha Error:', error);
 throw error;
 }
}

export interface SemesterOption {
 value: string;
 label: string;
}

export interface LoginResult {
 studentName?: string;
 success: boolean;
 message: string;
 session: ScraperSession;
 csrfToken: string;
 academicYears: SemesterOption[];
 semesters: SemesterOption[];
 deviceId?: string;
 needsCaptchaRetry?: boolean;
 initialDashboard?: any;
}

const DEVICE_COOKIE = 'kl_erp_device_id';

export async function loginAndFetchSemesters(
 username: string,
 pass: string,
 captcha: string,
 session: ScraperSession,
 deviceId?: string
): Promise<LoginResult> {
 const jar = arrayToJar(session.cookies);
 if (deviceId) jar[DEVICE_COOKIE] = deviceId;
 const params = new URLSearchParams();
 params.append('_csrf', session.csrfToken);
 params.append('LoginForm[username]', username);
 params.append('LoginForm[password]', pass);
 params.append('LoginForm[captcha]', captcha);
 params.append('LoginForm[qr_code]', ''); 
 params.append('LoginForm[rememberMe]', '1');
 params.append('login-button', '');
 const loginCookies = cookieHeader(jar);
 let loginRes: any;
 let attempt = 0;
 while (attempt < 2) {
 try {
 const pT0 = performance.now();
 loginRes = await undiciFetch(LOGIN_URL, {
 method: 'POST',
 headers: {
 'Cookie': loginCookies,
 'Content-Type': 'application/x-www-form-urlencoded',
 'User-Agent': session.userAgent,
 'Origin': ERP_URL,
 'Referer': LOGIN_URL,
 },
 body: params,
 redirect: 'manual',
 dispatcher: globalAgent,
 } as RequestInit & { dispatcher: any });
 console.log(`[AUTH TIMING] ERP login POST: ${Math.round(performance.now() - pT0)}ms`);
 break;
 } catch (e: any) {
 if (e.message && e.message.includes('fetch failed')) {
 if (attempt >= 2) throw e;
 } else {
 throw e;
 }
 }
 attempt++;
 await new Promise(r => setTimeout(r, 500));
 }
 mergeSetCookies(jar, loginRes);
 let loginText = '';
 if (loginRes.status >= 300 && loginRes.status < 400) {
 const location = loginRes.headers.get('location');
 await loginRes.arrayBuffer().catch(() => {});
 if (location) {
 const dest = new URL(location, LOGIN_URL).toString().replace(/^http:\/\//i, 'https://');
 const dT0 = performance.now();
 const destRes = await fetchWithJar(dest, jar);
 console.log(`[AUTH TIMING] ERP redirect: ${Math.round(performance.now() - dT0)}ms`);
 loginText = await destRes.text();
 }
 } else {
 loginText = await loginRes.text();
 }
 
 
  const attendanceRes = await fetchWithJar(ATTENDANCE_URL, jar, {
    extraHeaders: { Referer: LOGIN_URL },
  });
  const attendanceHtml = await attendanceRes.text();

  const isLoginForm =
    /LoginForm\[username\]/.test(attendanceHtml) ||
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

  const nameMatch = attendanceHtml.match(/Welcome\s+\d+\s+-\s+([^<]+)/i);
  if (nameMatch && nameMatch[1]) {
    studentName = nameMatch[1].trim();
  } else {
    const userMenuText = $('.navbar-custom-menu .user-menu span.hidden-xs').text().trim();
    if (userMenuText) {
      studentName = userMenuText.replace(/^\d+\s*-\s*/, '').trim();
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
  
  const authenticatedSession: ScraperSession = {
 ...session,
 cookies: jarToArray(jar),
 csrfToken,
 };
 let academicYears: SemesterOption[] = [];
 let semesters: SemesterOption[] = [];
 let initialDashboard: any = null;
 try {
 const academicInfo = await fetchAcademicInfo(authenticatedSession);
 academicYears = academicInfo.academicYears || [];
 semesters = academicInfo.semesters || [];
 if (academicYears.length > 0 && semesters.length > 0) {
 const defaultYear = academicYears[0].value;
 const oddSem = semesters.find(s => s.label.toLowerCase().includes('odd'));
 const defaultSemester = oddSem ? oddSem.value : semesters[0].value;
 console.log(`[login] Preloading dashboard attendance for ${defaultYear}-${defaultSemester}...`);
 const attResult = await fetchAttendanceData(authenticatedSession, csrfToken, defaultYear, defaultSemester);
 if (attResult && attResult.attendanceData) {
 initialDashboard = {
 attendanceData: attResult.attendanceData,
 academicYear: defaultYear,
 semesterId: defaultSemester,
 };
 }
 }
 } catch (preloadErr) {
 console.log('[login] Preload academic/dashboard error (non-fatal):', preloadErr);
 }
 console.log('[login] SUCCESS. Preloaded dashboard:', !!initialDashboard);
 return {
 success: true,
 message: 'Login Successful',
 studentName,
 session: authenticatedSession,
 csrfToken,
 academicYears,
 semesters,
 deviceId: jar[DEVICE_COOKIE],
 initialDashboard,
 };
}

export async function fetchAttendanceData(
 session: ScraperSession,
 csrfToken: string,
 academicYear: string,
 semesterId: string
) {
 const jar = arrayToJar(session.cookies);
 const ajaxParams = new URLSearchParams();
 ajaxParams.append('_csrf', csrfToken);
 ajaxParams.append('DynamicModel[academicyear]', academicYear);
 ajaxParams.append('DynamicModel[semesterid]', semesterId);
 console.log("START fetchAttendanceData");
 const start = Date.now();
 const courseListRes = await fetchWithJar(COURSE_LIST_URL, jar, {
 method: 'POST',
 body: ajaxParams,
 extraHeaders: {
 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
 'X-Requested-With': 'XMLHttpRequest',
 'Origin': ERP_URL,
 'Referer': ATTENDANCE_URL,
 },
 });
 const courseListHtml = await courseListRes.text();
 if (courseListHtml.includes('login-form') || courseListHtml.includes('site/login') || courseListHtml.includes('action="/index.php?r=site%2Flogin"')) {
 throw new Error('ERP Session expired. Please log out and log in again.');
 }
 console.log("END fetchAttendanceData in", Date.now() - start, "ms");
 const attendanceData = parseAttendanceHtml(courseListHtml);
 return {
 success: true,
 message: 'Attendance Data Fetched Successfully',
 attendanceData: attendanceData
 };
}

function parseAttendanceHtml(html: string) {
 const $ = cheerio.load(html);
 const table = $('table').first();
 const headers: string[] = [];
 const data: any[] = [];
 table.find('thead tr th').each((i, el) => {
 headers.push($(el).text().trim());
 });
 if (headers.length === 0) {
 const firstRow = table.find('tr').first();
 firstRow.find('th, td').each((i, el) => {
 headers.push($(el).text().trim());
 });
 }
 const tbodyRows = table.find('tbody tr').length > 0 ? table.find('tbody tr') : table.find('tr').slice(headers.length > 0 ? 1 : 0);
 tbodyRows.each((i, tr) => {
 const rowData: Record<string, string> = {};
 $(tr).find('td').each((j, td) => {
 const header = headers[j] || `Column_${j}`;
 const aTag = $(td).find('a, button, span[onclick]');
 if (aTag.length > 0) {
 const href = aTag.attr('href') || '';
 const onclick = aTag.attr('onclick') || '';
 const text = aTag.text().trim() || $(td).text().trim();
 rowData[header] = text;
 rowData[`${header}_link`] = href;
 rowData[`${header}_onclick`] = onclick;
 } else if ($(td).attr('onclick')) {
 rowData[header] = $(td).text().trim();
 rowData[`${header}_link`] = '';
 rowData[`${header}_onclick`] = $(td).attr('onclick') || '';
 } else {
 rowData[header] = $(td).text().trim();
 }
 });
 if (Object.keys(rowData).length > 0) {
 data.push(rowData);
 }
 });
 return data;
}

export async function fetchTimetableData(
 session: ScraperSession,
 csrfToken: string,
 academicYear: string,
 semesterId: string,
 courseCode?: string
) {
 const jar = arrayToJar(session.cookies);
 const ajaxParams = new URLSearchParams();
 ajaxParams.append('_csrf', csrfToken);
 ajaxParams.append('UniversityMasterAcademicTimetableView[academicyear]', academicYear);
 ajaxParams.append('UniversityMasterAcademicTimetableView[semesterid]', semesterId);
 console.log("START fetchTimetableData");
 const start = Date.now();
 const queryParams = new URLSearchParams();
 queryParams.append('r', 'timetables/universitymasteracademictimetableview/individualstudenttimetableget');
 queryParams.append('UniversityMasterAcademicTimetableView[academicyear]', academicYear);
 queryParams.append('UniversityMasterAcademicTimetableView[semesterid]', semesterId);
 const FETCH_URL = ERP_URL + '/index.php?' + queryParams.toString();
 
 const [getRes, res] = await Promise.all([
 fetchWithJar(TIMETABLE_URL, jar, {
 extraHeaders: { 'Referer': ERP_URL }
 }),
 fetchWithJar(FETCH_URL, jar, {
 method: 'POST',
 body: ajaxParams,
 extraHeaders: {
 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
 'Referer': TIMETABLE_URL,
 'User-Agent': USER_AGENT,
 'X-Requested-With': 'XMLHttpRequest',
 'X-Pjax': 'true'
 }
 })
 ]);
 const [getHtml, postHtml] = await Promise.all([
 getRes.text(),
 res.text()
 ]);
 if (getHtml.includes('login-form') || getHtml.includes('site/login') || getHtml.includes('action="/index.php?r=site%2Flogin"') ||
 postHtml.includes('login-form') || postHtml.includes('site/login') || postHtml.includes('action="/index.php?r=site%2Flogin"')) {
 throw new Error('ERP Session expired. Please log out and log in again.');
 }
 console.log("END fetchTimetableData in", Date.now() - start, "ms");
 
 let timetableData = parseTimetableHtml(getHtml);
 let finalHtml = getHtml;
 let usedSource = "GET";
 
 const getIsValid = isUsableTimetable(timetableData, courseCode);
 console.log(`[DIAGNOSTIC] GET parsed rows: ${timetableData.length}`);
 console.log(`[DIAGNOSTIC] GET contains selected course: ${getIsValid ? "YES" : "NO"}`);
 if (!getIsValid) {
 timetableData = parseTimetableHtml(postHtml);
 finalHtml = postHtml;
 usedSource = "POST";
 const postIsValid = isUsableTimetable(timetableData, courseCode);
 console.log(`[DIAGNOSTIC] POST parsed rows: ${timetableData.length}`);
 console.log(`[DIAGNOSTIC] POST contains selected course: ${postIsValid ? "YES" : "NO"}`);
 }
 
 let finalCourseMatches = 0;
 const normalizedTarget = courseCode ? courseCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : null;
 if (normalizedTarget) {
 for (const day of timetableData) {
 if (Array.isArray(day.slots)) {
 for (const slot of day.slots) {
 const text = (slot || '').trim();
 if (text && text !== '-' && !text.toLowerCase().includes('lunch') && !text.toLowerCase().includes('break')) {
 if (text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().includes(normalizedTarget)) {
 finalCourseMatches++;
 }
 }
 }
 }
 }
 }
 console.log(`[DIAGNOSTIC] Final source: ${usedSource}`);
 console.log(`[DIAGNOSTIC] Final course matches: ${finalCourseMatches}`);
 return {
 success: true,
 message: 'Timetable Data Fetched Successfully',
 timetableData,
 html: finalHtml, 
 htmlPreview: finalHtml.substring(0, 5000), 
 htmlLength: finalHtml.length
 };
}

function parseTimetableHtml(html: string) {
 const $ = cheerio.load(html);
 let timetable: any[] = [];
 $('table').each((i, table) => {
 const rows = $(table).find('tr');
 if (rows.length < 3) return;
 let hasDays = false;
 let currentTimetable: any[] = [];
 rows.each((j, row) => {
 const cells = $(row).find('td, th');
 if (cells.length < 2) return;
 const firstCell = $(cells[0]).text().trim().toLowerCase();
 if (firstCell.includes('mon') || firstCell.includes('tue') || firstCell.includes('wed') || firstCell.includes('thu') || firstCell.includes('fri') || firstCell.includes('sat')) {
 hasDays = true;
 const day = $(cells[0]).text().trim();
 const slots: string[] = [];
 for (let k = 1; k < cells.length; k++) {
 const cellHtml = $(cells[k]).html() || '';
 const cellWithNewlines = cellHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<\/div>|<\/p>|<\/li>/gi, '\n');
 const temp = cheerio.load(cellWithNewlines);
 let text = temp.text().trim();
 text = text.replace(/[^\S\r\n]+/g, ' ').replace(/\n\s*\n/g, '\n').trim();
 slots.push(text);
 }
 currentTimetable.push({ day, slots });
 }
 });
 if (hasDays && currentTimetable.length > timetable.length) {
 timetable = currentTimetable;
 }
 });
 return timetable;
}

export async function fetchAttendanceRegister(
 session: ScraperSession,
 url: string
) {
 console.log('START fetchAttendanceRegister. URL:', url);
 const start = Date.now();
 const jar = arrayToJar(session.cookies);
 console.log('fetchAttendanceRegister: fetching URL...', Date.now() - start);
 const resultRes = await fetchWithJar(url, jar, {
 extraHeaders: {
 'Referer': ATTENDANCE_URL
 }
 });
 console.log('fetchAttendanceRegister: fetch complete.', Date.now() - start);
 const html = await resultRes.text();
 console.log('fetchAttendanceRegister: HTML length:', html.length);
 const $ = cheerio.load(html);
 const table = $('table').first();
 const headers: string[] = [];
 const data: any[] = [];
 table.find('thead tr th, tr:first-child th').each((i, el) => {
 headers.push($(el).text().trim());
 });
 if (headers.length === 0) {
 table.find('tr').first().find('th, td').each((i, el) => {
 headers.push($(el).text().trim());
 });
 }
 const tbodyRows = table.find('tbody tr').length > 0 ? table.find('tbody tr') : table.find('tr').slice(headers.length > 0 ? 1 : 0);
 tbodyRows.each((i, tr) => {
 const rowData: Record<string, string> = {};
 $(tr).find('td').each((j, td) => {
 const header = headers[j] || `Column_${j}`;
 rowData[header] = $(td).text().trim();
 });
 if (Object.keys(rowData).length > 0) data.push(rowData);
 });
 return data;
}

export async function fetchAcademicInfo(session: ScraperSession): Promise<{ academicYears: SemesterOption[], semesters: SemesterOption[] }> {
 const jar = arrayToJar(session.cookies);
 const res = await fetchWithJar(ATTENDANCE_URL, jar, {
 extraHeaders: { Referer: ERP_URL }
 });
 const html = await res.text();
 const $ = cheerio.load(html);
 const academicYears: SemesterOption[] = [];
 $('select[name="DynamicModel[academicyear]"] option').each((i, el) => {
 const value = $(el).attr('value');
 const label = $(el).text().trim();
 if (value) academicYears.push({ value, label });
 });
 const semesters: SemesterOption[] = [];
 $('select[name="DynamicModel[semesterid]"] option').each((i, el) => {
 const value = $(el).attr('value');
 const label = $(el).text().trim();
 if (value) semesters.push({ value, label });
 });
 return { academicYears, semesters };
}

function isUsableTimetable(timetableData: any[], courseCode?: string): boolean {
 if (!Array.isArray(timetableData) || timetableData.length === 0) {
 return false;
 }
 let hasAnyClass = false;
 let foundTargetCourse = false;
 const normalizedTarget = courseCode ? courseCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : null;
 for (const day of timetableData) {
 if (Array.isArray(day.slots)) {
 for (const slot of day.slots) {
 const text = (slot || '').trim();
 if (text && text !== '-' && !text.toLowerCase().includes('lunch') && !text.toLowerCase().includes('break')) {
 hasAnyClass = true;
 if (normalizedTarget) {
 const normalizedSlot = text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
 if (normalizedSlot.includes(normalizedTarget)) {
 foundTargetCourse = true;
 }
 }
 }
 }
 }
 }
 if (normalizedTarget) {
 return foundTargetCourse;
 }
 return hasAnyClass;
}
