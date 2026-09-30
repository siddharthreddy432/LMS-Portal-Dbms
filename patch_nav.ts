import fs from 'fs';
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf-8');
content = content.replace(/\{ name: 'S-Dashboard'.*\n.*Timetable.*\n.*Attendance.*\n.*Calculator.*\/calculators'.*\n/g, "");
fs.writeFileSync('src/components/Navigation.tsx', content);
