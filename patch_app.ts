import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/import SDashboard.*\n/g, "");
content = content.replace(/import Timetable.*\n/g, "");
content = content.replace(/import Attendance.*\n/g, "");
content = content.replace(/import Calculators.*\n/g, "");

content = content.replace(/<Route path="\/sdashboard".*\n/g, "");
content = content.replace(/<Route path="\/timetable".*\n/g, "");
content = content.replace(/<Route path="\/attendance".*\n/g, "");
content = content.replace(/<Route path="\/calculators".*\n/g, "");

fs.writeFileSync('src/App.tsx', content);
