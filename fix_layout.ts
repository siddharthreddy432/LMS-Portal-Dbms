import fs from 'fs';
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// 1. Change grid to 1 column
content = content.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">', '<div className="flex flex-col gap-8">');
content = content.replace('<div className="lg:col-span-2 space-y-8">', '<div className="space-y-8">');

// 2. We'll move the Stats (Overall %) to the top, right before the Trend chart.
// Let's replace the whole Right Column block:
const rightColumnRegex = /\{\/\* Right Column \(Sidebar\) \*\/\}.*?(?=<\/div>\s*<\/div>\s*<\/>\s*\);\s*\})/s;
const rightColumnMatch = content.match(rightColumnRegex);
if (rightColumnMatch) {
    content = content.replace(rightColumnMatch[0], "");
} else {
    console.log("Right column not found");
}

// 3. Let's insert a Stats strip at the very top (before "Weekly Trend").
const statsStrip = `
          {/* Top Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
            <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl p-6 sticker-shadow-sm flex flex-col justify-center text-[var(--text-primary)]">
              <span className="font-bold text-[var(--text-secondary)] mb-1">Total Classes</span>
              <span className="font-black text-3xl">{summary.totalClasses}</span>
            </div>
            <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl p-6 sticker-shadow-sm flex flex-col justify-center text-[var(--text-primary)]">
              <span className="font-bold text-[var(--text-secondary)] mb-1">Total Attended</span>
              <span className="font-black text-3xl">{summary.attendedClasses}</span>
            </div>
            <div className="bg-white dark:bg-[#1B1F26] border-2 border-black dark:border-white/10 rounded-3xl p-6 sticker-shadow-sm flex flex-col justify-center text-[var(--text-primary)]">
              <span className="font-bold text-[var(--text-secondary)] mb-1">Overall %</span>
              <span className="font-black text-3xl text-brand-blue">{overallPercentage}%</span>
            </div>
          </div>
`;

content = content.replace(/\{\/\* Trend Chart \*\/\}/, statsStrip + '\n          {/* Trend Chart */}');

// 4. Put the logout button at the bottom of the page
const logoutButton = `
          <button 
            onClick={async () => {
              await logout();
              navigate('/login', { state: { message: 'Session expired. Please login again.' } });
            }}
            className="w-full sm:w-auto mx-auto px-8 py-4 mt-12 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-3 border-2 border-red-300 dark:border-red-800/60"
          >
            <LogOut size={20} />
            Logout from Portal
          </button>
`;
content = content.replace(/(?=<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">)/, `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">\n`);
content = content.replace(/<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">/, "");

content = content.replace(/(?=\{subjects\.length === 0 && !loading &&)/, logoutButton);
// wait, the logoutButton should go after the subjects list, not inside it.
content = content.replace(/(?=<\/div>\s*<\/div>\s*<\/>\s*\);\s*\})/, logoutButton);

fs.writeFileSync('src/pages/Dashboard.tsx', content);
