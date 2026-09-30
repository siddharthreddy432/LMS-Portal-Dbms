import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

// Remove timetable endpoints
content = content.replace(/app\.post\("\/api\/timetable"[\s\S]*?(?=app\.)/g, "");
// Remove expected attendance endpoints
content = content.replace(/app\.post\("\/api\/expected-attendance"[\s\S]*?(?=app\.)/g, "");
content = content.replace(/app\.post\("\/api\/attendance-register"[\s\S]*?(?=app\.)/g, "");
content = content.replace(/app\.post\("\/api\/extract-attendance"[\s\S]*?(?=app\.)/g, "");

fs.writeFileSync('server.ts', content);
