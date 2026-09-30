import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/import Contact from '.\/pages\/Contact';/, "import Contact from './pages/Contact';\nimport MyCourses from './pages/MyCourses';");
content = content.replace(/<Route path="\/contact" element=\{<PageTransition><Contact \/><\/PageTransition>\} \/>/, `<Route path="/courses" element={<ProtectedRoute><PageTransition><MyCourses /></PageTransition></ProtectedRoute>} />\n        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />`);
fs.writeFileSync('src/App.tsx', content);
