import { fetchTimetableData, fetchAttendanceData, fetchAttendanceRegister, fetchAcademicInfo, ScraperSession } from '../scraper/scraper.js';
import { GlobalCache } from '../store/Cache.js';

export function formatDashboardData(attendanceData: any[]) {
 const groups: { [key: string]: any[] } = {};

 (attendanceData || []).forEach((row: any) => {
 const getVal = (possibleKeys: string[]) => {
 for (const k of Object.keys(row)) {
 for (const pk of possibleKeys) {
 if (k.toLowerCase().includes(pk.toLowerCase())) return row[k];
 }
 }
 return '';
 };

 const code = getVal(['Course Code', 'Code']);
 if (code) {
 if (!groups[code]) groups[code] = [];
 groups[code].push(row);
 } else {
 const name = getVal(['Course Title', 'Coursedesc', 'Course Desc', 'Description', 'Name', 'Title']) || `Unknown-${Math.random()}`;
 groups[name] = [row];
 }
 });

 const subjects = Object.values(groups).map((items, index) => {
 const getVal = (row: any, possibleKeys: string[]) => {
 for (const k of Object.keys(row)) {
 for (const pk of possibleKeys) {
 if (k.toLowerCase().includes(pk.toLowerCase())) return row[k];
 }
 }
 return '';
 };
 
 const first = items[0];
 const code = getVal(first, ['Course Code', 'Code']);
 let name = '';
 let faculty = '';
 let timetable = '';
 
 for (const item of items) {
 if (!name) name = getVal(item, ['Course Title', 'Coursedesc', 'Course Desc', 'Description', 'Name', 'Title', 'Subject']);
 if (!faculty) faculty = getVal(item, ['Faculty Name', 'Faculty', 'Teacher', 'Employee', 'Instructor', 'Staff']);
 if (!timetable) timetable = getVal(item, ['Time Table', 'Timetable', 'Time', 'Slot', 'Schedule', 'Section', 'Room', 'Period']);
 }
 
 name = name || `Unknown Subject (${code || index})`;
 
 if (name && name === name.toUpperCase()) {
 name = name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
 }

 faculty = faculty || 'Faculty Not Listed';
 timetable = timetable || 'Timetable Not Listed';
 
 const components: Record<string, { total: number, attended: number, rawPercentage?: number }> = {};
 let hasLTPS = false;
 let rawTotal = 0;
 let rawAttended = 0;

 items.forEach((item: any) => {
 const ltpsRaw = (getVal(item, ['LTPS', 'Structure', 'L-T-P-S']) || '').toLowerCase().trim();
 const total = parseInt(getVal(item, ['Total Class', 'Total Held', 'Classes conducted', 'Conducted']), 10) || 0;
 const attended = parseInt(getVal(item, ['Total Present', 'Attended', 'Classes attended']), 10) || 0;
 const rawPctStr = getVal(item, ['Attendance Percentage', 'Percentage', '%']);
 let rawPct = 0;
 if (rawPctStr) {
 rawPct = parseFloat(rawPctStr);
 } else {
 rawPct = total > 0 ? (attended / total) * 100 : 0;
 }
 
 let type = '';
 if (ltpsRaw.includes('lecture') || ltpsRaw === 'l') type = 'L';
 else if (ltpsRaw.includes('tutorial') || ltpsRaw === 't') type = 'T';
 else if (ltpsRaw.includes('practical') || ltpsRaw === 'p') type = 'P';
 else if (ltpsRaw.includes('skilling') || ltpsRaw === 's') type = 'S';
 
 if (type) {
 hasLTPS = true;
 components[type] = { total, attended, rawPercentage: Math.round(rawPct) };
 }
 rawTotal += total;
 rawAttended += attended;
 });
 
 let percentage = 0;
 if (hasLTPS) {
 let wSum = 0;
 let weightedSum = 0;
 const weights: any = { L: 1, T: 0.25, P: 0.5, S: 0.25 };
 Object.keys(components).forEach(k => {
 const c = components[k];
 if (c.total > 0) {
 wSum += weights[k];
 weightedSum += (c.attended / c.total * 100) * weights[k];
 }
 });
 percentage = wSum > 0 ? Math.ceil(weightedSum / wSum) : 0;
 } else {
 percentage = rawTotal > 0 ? Math.ceil((rawAttended / rawTotal) * 100) : 0;
 }

 return {
 id: index.toString(),
 name: name || `Subject ${index+1}`,
 code: code || `SUB${index+1}`,
 faculty: faculty || 'Unknown Faculty',
 timetable: timetable || 'TBA',
 totalClasses: rawTotal,
 attendedClasses: rawAttended,
 attendancePercentage: percentage,
 components: hasLTPS ? components : undefined
 };
 });

 const totalClasses = subjects.reduce((sum: number, s: any) => sum + s.totalClasses, 0);
 const attendedClasses = subjects.reduce((sum: number, s: any) => sum + s.attendedClasses, 0);
 const overallAttendance = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
 
 const summary = {
 overallAttendance,
 totalClasses,
 attendedClasses,
 classesTo85: 0,
 classesTo75: 0
 };

 return {
 summary,
 subjects,
 raw: attendanceData
 };
}

export class ERPService {
 async getAcademicInfo(session: ScraperSession) {
 const key = this.getCacheKey(session, 'academicInfo');
 if (this.cache.has(key)) return this.cache.get(key);
 
 console.log('[ERP] Fetching Academic Info');
 const data = await fetchAcademicInfo(session);
 if (data && data.academicYears.length > 0) this.cache.set(key, data);
 return data;
 }

 private cache = GlobalCache.getInstance();

 public setCache(session: ScraperSession, type: string, params: string, data: any) {
 const key = this.getCacheKey(session, type, params);
 this.cache.set(key, data);
 }

 private getCacheKey(session: ScraperSession, type: string, params: string = '') {
 const phpSessId = session.cookies?.find(c => c.name === 'PHPSESSID')?.value;
 const idKey = phpSessId || session.cookies?.map(c => c.name + '=' + c.value).sort().join(';') || 'guest';
 return `${idKey}-${type}-${params}`;
 }

 async getTimetable(session: ScraperSession, csrfToken: string, academicYear: string, semesterId: string, forceRefresh = false, courseCode?: string) {
 const key = this.getCacheKey(session, 'timetable', `${academicYear}-${semesterId}`);
 if (!forceRefresh && this.cache.has(key)) {
 const cached = this.cache.get(key);
 let containsCourse = true;
 if (courseCode && cached && cached.timetableData) {
 containsCourse = false;
 const normalizedTarget = courseCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
 for (const day of cached.timetableData) {
 if (Array.isArray(day.slots)) {
 for (const slot of day.slots) {
 const text = (slot || '').trim();
 if (text && text !== '-' && text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().includes(normalizedTarget)) {
 containsCourse = true;
 break;
 }
 }
 }
 if (containsCourse) break;
 }
 }
 if (containsCourse) return cached;
 console.log(`[ERP] Cached timetable missing ${courseCode}, bypassing cache...`);
 }
 
 console.log(`[ERP] Fetching Timetable for ${academicYear}-${semesterId}`);
 const data = await fetchTimetableData(session, csrfToken, academicYear, semesterId, courseCode);
 if (data && data.timetableData) this.cache.set(key, data);
 return data;
 }

 async getDashboard(session: ScraperSession, csrfToken: string, academicYear: string, semesterId: string, forceRefresh = false) {
 const key = this.getCacheKey(session, 'dashboard', `${academicYear}-${semesterId}`);
 if (!forceRefresh && this.cache.has(key)) return this.cache.get(key);
 
 console.log(`[ERP] Fetching Dashboard for ${academicYear}-${semesterId}`);
 const data = await fetchAttendanceData(session, csrfToken, academicYear, semesterId);
 if (data && data.attendanceData) this.cache.set(key, data);
 return data;
 }

 async getAttendanceRegister(session: ScraperSession, link: string, onclick: string, forceRefresh = false) {
 const key = this.getCacheKey(session, 'register', `${link}-${onclick}`);
 if (!forceRefresh && this.cache.has(key)) return this.cache.get(key);
 
 console.log(`[ERP] Fetching Attendance Register`);
 let registerData: any[] = [];
 let url = '';
 const ERP_URL = 'https://newerp.kluniversity.in';
 if (link && link !== '#') {
 url = link.startsWith('http') ? link.replace(/&amp;/g, '&') : `${ERP_URL}${link.startsWith('/') ? '' : '/'}${link}`.replace(/&amp;/g, '&');
 } else if (onclick) {
 const match = onclick.match(/'(\/index\.php\?[^']+)'/);
 if (match) url = `${ERP_URL}${match[1]}`.replace(/&amp;/g, '&');
 }
 if (url) {
 registerData = await fetchAttendanceRegister(session, url);
 }
 if (registerData && registerData.length > 0) this.cache.set(key, registerData);
 return registerData;
 }
}
