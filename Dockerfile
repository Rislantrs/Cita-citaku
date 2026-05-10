# 1. Gunakan Node.js versi terbaru yang stabil
FROM node:20-slim

# 2. Tentukan folder kerja di dalam server Google
WORKDIR /app

# 3. Copy file konfigurasi dependencies
COPY package*.json ./

# 4. Install library yang dibutuhkan saja (biar ringan)
RUN npm install

# 5. Copy semua kode project bapak ke dalam server
COPY . .

# 6. Build Frontend bapak (Vite) jadi file statis
RUN npm run build

# 7. Beritahu port mana yang dipakai (Backend bapak pakai 3001)
EXPOSE 3001

# 8. Perintah untuk menyalakan aplikasi
CMD ["node", "backend/server.js"]
