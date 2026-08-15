import fs from 'fs';

const pages = [
  'Home', 'History', 'Productions', 'Museum', 
  'HallOfFame', 'Community', 'Events', 'Register', 'Dashboard'
];

for (const page of pages) {
  const content = `export default function ${page}() {
  return (
    <div className="pt-24 min-h-screen px-6 lg:px-12">
      <h1 className="text-4xl font-heading mb-6">${page}</h1>
      <p className="text-supporting">This page is under construction.</p>
    </div>
  );
}
`;
  fs.writeFileSync(`src/pages/${page}.jsx`, content);
}
