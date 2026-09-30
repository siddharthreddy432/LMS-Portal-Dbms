import fs from 'fs';
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf-8');
content = content.replace(/Library/g, "Gamepad2");
fs.writeFileSync('src/components/Navigation.tsx', content);

let coursesContent = fs.readFileSync('src/pages/MyCourses.tsx', 'utf-8');
coursesContent = coursesContent.replace(/Library/g, "Gamepad2");
fs.writeFileSync('src/pages/MyCourses.tsx', coursesContent);
