import fs from 'fs';
let content = fs.readFileSync('src/pages/Landing.tsx', 'utf-8');

// Replace links to removed routes
content = content.replace(/<Link[\s\S]*?to="\/calculators"[\s\S]*?<\/Link>/g, "");

// Remove FeatureCards related to removed components
content = content.replace(/<FeatureCard\s+icon=\{\<Calculator.*?\/\>\}\s+title="Smart Calculators"[\s\S]*?\/\>/g, "");
content = content.replace(/<FeatureCard\s+icon=\{\<CalendarDays.*?\/\>\}\s+title="Timetable \& Schedule"[\s\S]*?\/\>/g, "");
content = content.replace(/<FeatureCard\s+icon=\{\<Table.*?\/\>\}\s+title="Attendance Dashboard"[\s\S]*?\/\>/g, "");

fs.writeFileSync('src/pages/Landing.tsx', content);
