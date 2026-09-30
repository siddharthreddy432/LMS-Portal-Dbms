import fs from 'fs';
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// Replace onClick navigations to removed pages
content = content.replace(/onClick=\{.*?navigate\('(?:\/attendance|\/calculators|\/sdashboard|\/timetable)'\)\}/g, "");

fs.writeFileSync('src/pages/Dashboard.tsx', content);
