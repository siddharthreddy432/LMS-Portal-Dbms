import fs from 'fs';
let content = fs.readFileSync('src/pages/Login.tsx', 'utf-8');

// Remove Auto-solve related things from Login.tsx
content = content.replace(/const autoSolveCaptcha.*?finally \{\s*setSolvingCaptcha\(false\);\s*\}\s*\};\s*/gs, "");

// Remove auto-solve button from JSX
content = content.replace(/<button\s*type="button"\s*onClick=\{autoSolveCaptcha\}[\s\S]*?<\/button>/g, "");

fs.writeFileSync('src/pages/Login.tsx', content);
