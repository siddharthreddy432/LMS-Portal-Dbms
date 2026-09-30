import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

// Remove ocr import and usage
content = content.replace(/import \{ solveCaptchaWithOCRSpace \}.*\n/g, "");
content = content.replace(/app\.post\("\/api\/auth\/solve-captcha"[\s\S]*?(?=app\.)/g, "");

fs.writeFileSync('server.ts', content);
