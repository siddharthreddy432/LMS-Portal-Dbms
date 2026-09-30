import fs from 'fs';
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

// Remove all instances of the logout button that were added incorrectly
content = content.replace(/<button\s*onClick=\{async \(\) => \{\s*await logout\(\);\s*navigate\('\/login'.*?\);\s*\}\}.*?Logout from Portal\s*<\/button>/gs, "");

// Place it properly at the end of the space-y-8 container
content = content.replace(
  /\{\s*subjects\.length === 0 && !loading && \([\s\S]*?<\/div>\s*\)\s*\}\s*<\/div>\s*<\/div>\s*<\/div>/g,
  `{subjects.length === 0 && !loading && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 p-8 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl text-center text-[var(--text-muted)] font-bold bg-white dark:bg-[#1B1F26]">
                No attendance data found for this semester.
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <div className="pt-8">
            <button 
              onClick={async () => {
                await logout();
                navigate('/login', { state: { message: 'Session expired. Please login again.' } });
              }}
              className="w-full sm:w-auto mx-auto px-8 py-4 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-3 border-2 border-red-300 dark:border-red-800/60 sticker-shadow-sm hover:sticker-shadow-hover"
            >
              <LogOut size={20} />
              Logout from Portal
            </button>
          </div>
        </div>
      </div>`
);
fs.writeFileSync('src/pages/Dashboard.tsx', content);
