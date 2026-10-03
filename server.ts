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
    ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
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

// --- LMS Endpoints ---
const lmsStoreFile = path.join(process.cwd(), "data", "lms-store.json");

function getLmsStore() {
  try {
    if (fs.existsSync(lmsStoreFile)) {
      return JSON.parse(fs.readFileSync(lmsStoreFile, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading LMS store:", e);
  }
  return { materials: [], assignments: [], announcements: [] };
}

function saveLmsStore(data: any) {
  try {
    fs.writeFileSync(lmsStoreFile, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving LMS store:", e);
  }
}

app.get("/api/lms/materials", (req, res) => {
  const store = getLmsStore();
  res.json({ success: true, materials: store.materials || [] });
});

app.post("/api/lms/materials", (req, res) => {
  const store = getLmsStore();
  const material = req.body;
  if (!material.id) material.id = `mat-${Date.now()}`;
  material.uploadedAt = material.uploadedAt || new Date().toISOString();
  store.materials = [material, ...(store.materials || [])];
  saveLmsStore(store);
  res.json({ success: true, material });
});

app.delete("/api/lms/materials/:id", (req, res) => {
  const store = getLmsStore();
  store.materials = (store.materials || []).filter((m: any) => m.id !== req.params.id);
  saveLmsStore(store);
  res.json({ success: true });
});

app.get("/api/lms/assignments", (req, res) => {
  const store = getLmsStore();
  res.json({ success: true, assignments: store.assignments || [] });
});

app.post("/api/lms/assignments", (req, res) => {
  const store = getLmsStore();
  const assignment = req.body;
  if (!assignment.id) assignment.id = `asg-${Date.now()}`;
  store.assignments = [assignment, ...(store.assignments || [])];
  saveLmsStore(store);
  res.json({ success: true, assignment });
});

app.get("/api/lms/announcements", (req, res) => {
  const store = getLmsStore();
  res.json({ success: true, announcements: store.announcements || [] });
});

app.post("/api/lms/announcements", (req, res) => {
  const store = getLmsStore();
  const announcement = req.body;
  if (!announcement.id) announcement.id = `ann-${Date.now()}`;
  store.announcements = [announcement, ...(store.announcements || [])];
  saveLmsStore(store);
  res.json({ success: true, announcement });
});

// --- AI Doubt Clarification Chatbot Endpoint ---
function generateAcademicFallbackResponse(query: string, courseCode?: string): string {
  const lower = (query || "").toLowerCase();
  
  if (lower.includes("avl") || lower.includes("rotation") || lower.includes("tree")) {
    return `### AVL Tree Balance & Rotation Guide

In an AVL tree, the Balance Factor (BF) of any node is:
BF(node) = Height(LeftSubtree) - Height(RightSubtree)
An AVL invariant requires BF ∈ {-1, 0, +1}.

#### The 4 Rotation Cases:
1. LL (Left-Left): Single Right Rotation around the unbalanced node.
2. RR (Right-Right): Single Left Rotation around the unbalanced node.
3. LR (Left-Right): Double rotation — first a Left Rotation on the left child, then a Right Rotation on the unbalanced root.
4. RL (Right-Left): Double rotation — first a Right Rotation on the right child, then a Left Rotation on the unbalanced root.

\`\`\`cpp
// C++ Single Right Rotation Implementation
Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = max(height(y->left), height(y->right)) + 1;
    x->height = max(height(x->left), height(x->right)) + 1;
    return x;
}
\`\`\`

**Time Complexity:** O(log n) for search, insertion, and deletion!`;
  }

  if (lower.includes("bcnf") || lower.includes("3nf") || lower.includes("normal") || lower.includes("database")) {
    return `### Database Normalization: 3NF vs BCNF

* Third Normal Form (3NF):
  For every non-trivial functional dependency X → Y:
  1. X must be a Superkey, OR
  2. Y is a Prime Attribute (part of some Candidate Key).

* Boyce-Codd Normal Form (BCNF):
  A stricter form of 3NF. For every non-trivial functional dependency X → Y:
  X MUST be a Superkey (no exceptions for prime attributes!).

**Key Takeaway:** Every relation in BCNF is guaranteed to be in 3NF, but not every 3NF relation is in BCNF. BCNF eliminates all redundancy due to functional dependencies.`;
  }

  if (lower.includes("react") || lower.includes("optimistic") || lower.includes("hook") || lower.includes("frontend")) {
    return `### React 19 & Optimistic UI Architecture

React 19 introduces native hooks to manage asynchronous UI transitions without lag:

1. \`useOptimistic()\`:
   Allows you to render immediate visual state before a server action completes. If the server action rejects or fails, React automatically discards the optimistic value and reverts to the previous authoritative state!

2. \`useActionState()\`:
   Manages pending loading states and form errors natively with zero boilerplate.

\`\`\`tsx
// Example of useOptimistic in a Doubt Reply thread
const [optimisticReplies, addOptimisticReply] = useOptimistic(
  replies,
  (state, newReplyText) => [
    ...state,
    { id: 'temp-id', content: newReplyText, pending: true }
  ]
);
\`\`\``;
  }

  if (lower.includes("svd") || lower.includes("eigen") || lower.includes("ai") || lower.includes("machine learning")) {
    return `### Singular Value Decomposition (SVD) in AI

Any real matrix A ∈ ℝ^(m × n) can be factored as:
A = U · Σ · Vᵀ

Where:
* U (m × m): Left singular vectors (eigenvectors of A · Aᵀ)
* Σ (m × n): Diagonal matrix containing singular values σ₁ ≥ σ₂ ≥ … ≥ 0
* Vᵀ (n × n): Right singular vectors (eigenvectors of Aᵀ · A)

**Eckart–Young Theorem:** Retaining the top k singular values gives the mathematically optimal rank-k approximation of A in Frobenius norm! Used in PCA, Latent Semantic Analysis (LSA), and recommender systems.`;
  }

  return `### Academic Concept Breakdown

Great question regarding **${courseCode || "your coursework"}**!

Here is how to approach this concept step-by-step:

1. **Core Intuition:** Start by breaking the problem into the base case and recursive or iterative invariants.
2. **Formal Definition:** Review the syllabus unit lecture notes in the Course Materials Hub for the complete formal proof.
3. **Practical Implementation:** Verify edge cases (e.g. empty lists, single node boundaries, null pointers, off-by-one indices).

Feel free to paste your specific code snippet or math expression, and I will step through it line-by-line with you!`;
}

app.post("/api/ai/doubt-chat", async (req, res) => {
  try {
    const { messages, courseCode, currentDoubt } = req.body;
    const query = currentDoubt || (messages && messages[messages.length - 1]?.content) || "";

    const systemInstruction = `You are "KLU Academic AI Tutor" — an expert academic mentor for engineering and computer science students at KL University.
Current Subject: ${courseCode || 'Computer Science & Engineering'}.
Your mission is to clarify students' doubts with utmost clarity, patience, and enthusiasm.

CRITICAL FORMATTING RULES:
1. Do NOT use LaTeX math delimiters ($ or $$). Write all mathematical equations in clean, readable plain Unicode characters (e.g., A = U · Σ · Vᵀ, O(log n), A ∈ ℝ^(m×n), σ₁ ≥ σ₂ ≥ 0, X → Y).
2. Never enclose titles in raw asterisks like **### Title** or **Title** in headings. Use plain headings like "### Title".
3. Use clean code snippets with language tags (cpp, java, python, tsx, sql).
4. Break down complex logic with bullet points and bold key terms.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const client = getGenAI();
        const formattedContents = [];

        if (Array.isArray(messages) && messages.length > 0) {
          for (const msg of messages) {
            formattedContents.push({
              role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            });
          }
        } else {
          formattedContents.push({
            role: 'user',
            parts: [{ text: query }]
          });
        }

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const replyText = response.text || generateAcademicFallbackResponse(query, courseCode);
        return res.json({ success: true, reply: replyText });
      } catch (err: any) {
        console.error("Gemini API call failed, using academic fallback:", err.message);
        const fallback = generateAcademicFallbackResponse(query, courseCode);
        return res.json({ success: true, reply: fallback });
      }
    } else {
      const fallback = generateAcademicFallbackResponse(query, courseCode);
      return res.json({ success: true, reply: fallback });
    }
  } catch (error: any) {
    console.error("Error in /api/ai/doubt-chat:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
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
