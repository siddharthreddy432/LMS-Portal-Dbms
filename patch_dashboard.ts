import fs from 'fs';
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// Remove timetable related code
content = content.replace(/const \[timetableData, setTimetableData\][^;]+;/g, "");
content = content.replace(/const \[loadingTimetable, setLoadingTimetable\][^;]+;/g, "");
content = content.replace(/const \[todayClasses, setTodayClasses\][^;]+;/g, "");
content = content.replace(/const fetchTimetable = async[\s\S]*?fetchTimetable\(\);\n  \}\, \[\]\);/g, "");

// Remove ERP Attendance List button
content = content.replace(/<Link[\s\S]*?to="\/attendance"[\s\S]*?<\/Link>/g, "");

// Remove Safe Bunk Predictor block
content = content.replace(/\{!-- Safe Bunk Predictor --\}[\s\S]*?(?=\{!-- Quick Actions --\})/g, "");
content = content.replace(/\{!-- Today's Timetable --\}[\s\S]*?(?=\{!-- Academic Info --\})/g, "");
content = content.replace(/<div className="lg:col-span-1 space-y-6">[\s\S]*?<div className="bg-white dark:bg-\[#1B1F26\]/g, '<div className="lg:col-span-1 space-y-6">\n        {/* Right column start */}\n        <div className="bg-white dark:bg-[#1B1F26]');

// Try writing it back
fs.writeFileSync('src/pages/Dashboard.tsx', content);
