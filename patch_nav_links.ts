import fs from 'fs';
let content = fs.readFileSync('src/components/Navigation.tsx', 'utf-8');
content = content.replace(
  /const links = \[[\s\S]*?\];/m,
  `const links = [
    { name: 'Home', path: '/', icon: <Home size={17} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <PieChart size={17} /> },
    { name: 'My Courses', path: '/courses', icon: <Library size={17} /> },
    { name: 'New ERP', path: 'https://klhunderground.ai.studio/', icon: <ExternalLink size={17} />, external: true },
    { name: 'Website', path: 'https://klh.edu.in/bachupally/', icon: <Globe size={17} />, external: true },
    { name: 'Contact', path: '/contact', icon: <MessageSquareHeart size={17} /> },
  ];`
);
fs.writeFileSync('src/components/Navigation.tsx', content);
