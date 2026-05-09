import 'dotenv/config';
import { createRequire } from 'module';
import fs from 'fs/promises';
import { callAI } from '../backend/ai_service.ts';

const require = createRequire(import.meta.url);
const pdfLib = require('pdf-parse');

async function test() {
  try {
    const filePath = './Tes_RIASEC_Jurusan_Kuliah.pdf';
    console.log('--- DIAGNOSA START ---');
    
    // 1. Check File
    await fs.access(filePath);
    console.log('✅ File PDF ditemukan.');

    // 2. Test PDF Parsing
    console.log('⏳ Mencoba membaca PDF dengan PDFParse class...');
    const buffer = await fs.readFile(filePath);
    
    // Use the class as found in our discovery
    const parser = new pdfLib.PDFParse({ data: buffer });
    const result = await parser.getText();
    const extractedText = result.text;
    
    console.log('✅ PDF Berhasil dibaca!');
    console.log('Total karakter:', extractedText.length);
    console.log('Potongan awal teks:', extractedText.substring(0, 150).replace(/\n/g, ' ') + '...');

    // 3. Test AI Call
    console.log('\n⏳ Mencoba memanggil AI Generator...');
    const aiResponse = await callAI('generator', `Gunakan teks berikut untuk membuat 2 soal RIASEC sederhana saja:\n\n${extractedText.substring(0, 1000)}`);
    console.log('✅ AI Merespon!');
    console.log('Potongan Output AI:', aiResponse.text.substring(0, 300) + '...');

    console.log('\n--- DIAGNOSA SELESAI: SEMUA OK ---');
  } catch (err) {
    console.error('\n❌ DIAGNOSA GAGAL!');
    console.error('Error Detail:', err.message);
    if (err.stack) console.error(err.stack);
  }
}

test();
