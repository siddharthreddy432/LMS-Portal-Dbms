import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(/import \{ expectedAttendanceEngine \} from '\.\/server\/engine\/expectedAttendance\/ExpectedAttendanceEngine\.js';\s*\n?/g, "");
fs.writeFileSync('server.ts', content);
