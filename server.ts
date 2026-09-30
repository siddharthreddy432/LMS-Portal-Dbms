import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { getCaptcha, loginAndFetchSemesters, ScraperSession } from "./server/scraper/scraper.js";
import { ERPService, formatDashboardData } from "./server/erp/ERPService.js";
const erpService = new ERPService();
import { decodeSession, encodeSession } from "./server/scraper/session.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import { z } from "zod";
import crypto from "crypto";

const app = express();
app.set('trust proxy', 1);
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

// Security Middlewares
app.use(helmet({
 contentSecurityPolicy: isProd ? {
 directives: {
 defaultSrc: ["'self'"],
 scriptSrc: ["'self'", "'unsafe-inline'"],
 styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
 fontSrc: ["'self'", "https://fonts.gstatic.com"],
 imgSrc: ["'self'", "data:", "blob:"],
 connectSrc: ["'self'"]
 }
 } : false
}));

const allowedOrigins = process.env.NODE_ENV === 'production' 
 ? [process.env.APP_URL].filter(Boolean) 
 : true;
app.use(cors({ origin: allowedOrigins as any, credentials: true }));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(hpp());

// Rate Limiting
const apiLimiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 300,
 message: { error: 'Too many requests from this IP' },
 validate: { xForwardedForHeader: false }
});

const authLimiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 50,
 message: { error: 'Too many login attempts from this IP' },
 validate: { xForwardedForHeader: false }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

const upload = multer({ 
 storage: multer.memoryStorage(),
 limits: { fileSize: 5 * 1024 * 1024 },
 fileFilter: (req, file, cb) => {
 const allowed = ['image/jpeg', 'image/png', 'image/webp'];
 if (allowed.includes(file.mimetype)) {
 cb(null, true);
 } else {
 cb(new Error('Invalid file type'));
 }
 }
});

let ai: GoogleGenAI | null = null;
function getGenAI() { 
 if (!ai) {
 if (!process.env.GEMINI_API_KEY) {
 throw new Error("GEMINI_API_KEY is missing");
 }
 ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
 }
 return ai;
}

const loginSchema = z.object({
 username: z.string().min(1),
 password: z.string().min(1),
 captcha: z.string().min(1),
 deviceId: z.string().optional()
});

const solveCaptchaSchema = z.object({ image: z.string().min(1) });
const fetchSchema = z.object({
 academicYear: z.any().optional(),
 semesterId: z.any().optional(),
 forceRefresh: z.boolean().optional()
});

const cookieOpts = { httpOnly: true, secure: true, sameSite: 'none' as const, path: '/' };

// --- Authentication & Scraping Endpoints ---
app.get("/api/auth/captcha", async (req, res) => {
 const t0 = performance.now();
 try {
 const { captchaImage, session } = await getCaptcha();
 const sessionId = encodeSession(session);
 res.cookie('app_session', sessionId, { ...cookieOpts, maxAge: 30 * 60 * 1000 }); // 30 mins
 console.log(`[AUTH TIMING] captcha endpoint: ${Math.round(performance.now() - t0)}ms`);
 res.json({ image: captchaImage, sessionId });
 } catch (error) {
 console.log("Error in captcha route:", error);
 res.status(500).json({ error: "Internal Error" });
 }
});

app.post("/api/auth/login", async (req: any, res: any) => {
 const t0 = performance.now();
 try {
 const parsed = loginSchema.safeParse(req.body);
 if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
 const { username, password, captcha, deviceId } = parsed.data;
 
 const sessionId = req.headers['x-session-id'] || req.cookies.app_session || req.body.sessionId;
 if (!sessionId) return res.status(401).json({ error: 'Session expired. Please refresh captcha.' });
 const cookieDeviceId = req.cookies['kl_device'] || req.headers['x-device-id'] || req.body.deviceId;
 const effectiveDeviceId = deviceId || cookieDeviceId || '';
 
 let session: ScraperSession;
 try {
 session = decodeSession(sessionId);
 } catch (e) {
 return res.status(401).json({ error: 'Invalid session. Please refresh captcha.' });
 }
 
 let result: any;
 try {
 result = await loginAndFetchSemesters(username, password, captcha, session, effectiveDeviceId);
 } catch (error: any) {
 const isCaptchaError = error.message.includes('Captcha') || error.message.includes('verification code');
 if (isCaptchaError) {
 return res.json({
 success: false,
 needsCaptchaRetry: true,
 message: error.message
 });
 }
 throw error;
 }
 
 if (!result) throw new Error("Login failed");
 
 const updatedSessionId = encodeSession(result.session);
 
 res.cookie('app_session', updatedSessionId, { ...cookieOpts }); // session cookie
 
 if (result.deviceId) { 
 res.cookie('kl_device', result.deviceId, { ...cookieOpts, maxAge: 180 * 24 * 60 * 60 * 1000 }); // 180 days
 }
 
 if (result.csrfToken) {
 res.cookie('app_csrf', result.csrfToken, { ...cookieOpts, maxAge: 24 * 60 * 60 * 1000 });
 }
 if (result.needsCaptchaRetry) {
 return res.json({
 success: false,
 needsCaptchaRetry: true,
 deviceId: result.deviceId,
 message: result.message} );
 }
 
 let initialDashboardData: any = null;
 if (result.initialDashboard && result.initialDashboard.attendanceData) {
 // Seed the cache so future requests are instant
 if (result.academicYears?.length > 0) {
 erpService.setCache(result.session, 'academicInfo', '', {
 academicYears: result.academicYears,
 semesters: result.semesters
 });
 }
 erpService.setCache(
 result.session,
 'dashboard',
 `${result.initialDashboard.academicYear}-${result.initialDashboard.semesterId}`,
 {
 success: true,
 message: 'Attendance Data Fetched Successfully',
 attendanceData: result.initialDashboard.attendanceData
 }
 );
 const formatted = formatDashboardData(result.initialDashboard.attendanceData);
 initialDashboardData = {
 ...formatted,
 academicYear: result.initialDashboard.academicYear,
 semesterId: result.initialDashboard.semesterId
 };
 }
 
 res.json({
 success: true,
 message: 'Login successful',
 sessionId: updatedSessionId,
 csrfToken: result.csrfToken,
 deviceId: result.deviceId,
 academicYears: result.academicYears,
 semesters: result.semesters,
 user: {
 id: username,
 name: result.studentName || 'Student',
 academicYears: result.academicYears,
 semesters: result.semesters,
 },
 initialDashboard: initialDashboardData
 });
 } catch (error: any) {
 console.log('Login error:', error.message);
 res.status(401).json({ error: error.message || 'Login failed' });
 }
});

app.post("/api/user/academic-info", async (req: any, res: any) => {
 try {
 const sessionId = req.headers['x-session-id'] || req.cookies.app_session || req.body.sessionId;
 if (!sessionId) return res.status(401).json({ error: 'Unauthorized' });
 
 let session;
 try {
 session = decodeSession(sessionId);
 } catch (e) {
 return res.status(401).json({ error: 'Invalid session' });
 }
 
 const result = await erpService.getAcademicInfo(session);
 res.json(result);
 } catch (error: any) {
 console.log('Academic info error:', error);
 res.status(500).json({ error: error.message || 'Failed to fetch academic info' });
 }
});

app.post("/api/auth/logout", (req, res) => {
 res.clearCookie('app_session', { path: '/', sameSite: 'none', secure: true });
 res.clearCookie('app_csrf', { path: '/', sameSite: 'none', secure: true });
 res.json({ success: true });
});

app.post("/api/dashboard", async (req: any, res: any) => {
 console.log("START API /api/dashboard");
 const start = Date.now();
 try {
 const parsed = fetchSchema.safeParse(req.body);
 if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
 const { academicYear, semesterId } = parsed.data;
 const sessionId = req.headers['x-session-id'] || req.cookies.app_session || req.body.sessionId;
 const csrfToken = req.headers['x-csrf-token'] || req.cookies.app_csrf || req.body.csrfToken;
 if (!sessionId || !csrfToken) {
 console.warn('Unauthorized request'); 
 return res.status(401).json({ error: 'Unauthorized' });
 }
 
 let session: ScraperSession;
 try {
 session = decodeSession(sessionId);
 } catch (e) {
 return res.status(401).json({ error: 'Invalid session' });
 }
 
 const forceRefresh = req.body.forceRefresh === true;
 const result = await erpService.getDashboard(session, csrfToken, academicYear, semesterId, forceRefresh);
 const formatted = formatDashboardData(result.attendanceData);
 console.log("END API /api/dashboard in", Date.now() - start, "ms");
 
 res.json(formatted);
 } catch (error: any) {
 console.log('Fetch Attendance error:', error);
 const status = (error?.message || '').includes('Session expired') ? 401 : 500;
 res.status(status).json({ error: error.message || 'Failed to fetch attendance' });
 }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
 console.log('Unhandled Error:', err);
 res.status(500).json({ error: 'Internal Server Error' });
});

async function startServer() {
 if (process.env.NODE_ENV !== "production") {
 const vite = await createViteServer({
 server: { middlewareMode: true },
 appType: "spa"
 });
 app.use(vite.middlewares);
 } else {
 const distPath = path.join(process.cwd(), "dist");
 app.use(express.static(distPath));
 app.get("*", (req, res) => {
 res.sendFile(path.join(distPath, "index.html"));
 });
 }
 app.listen(PORT, "0.0.0.0", () => {
 console.log(`Server running on port ${PORT}`);
 });
}
startServer();
