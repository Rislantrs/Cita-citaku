import fs from 'fs';

const filePath = 'c:/Users/Rislan/OneDrive/Dokumen/Project/cita-citaku/scripts/seed-tech.mjs';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove markdown links [url](url) -> url
content = content.replace(/\[https?:\/\/.*?\]\((https?:\/\/.*?)\)/g, '$1');

// 2. Fix nested arrays [[ ... ]]
content = content.replace(/const techCareers = \[\s*\[/g, 'const techCareers = [');
content = content.replace(/\]\s*\];/g, '];');

// 3. Rename fields to match schema
content = content.replace(/"judul":/g, '"title":');
content = content.replace(/"idKategori":/g, '"categoryId":');
content = content.replace(/"rekomendasiJurusan":/g, '"recommendationMajors":');
content = content.replace(/"kategoriRIASEC":/g, '"riasecCategories":');
content = content.replace(/"tagMBTI":/g, '"mbtiTags":');

fs.writeFileSync(filePath, content);
console.log('Cleanup complete!');
