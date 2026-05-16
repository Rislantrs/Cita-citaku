# 1. Gunakan Node.js versi 20
FROM node:20-slim

# 2. Tentukan folder kerja
WORKDIR /app

# 3. Copy file package.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy semua kode sumber
COPY . .

# 6. Build aplikasi (Frontend & Backend bundle)
RUN npm run build

# 7. Cloud Run akan memberikan port via environment variable PORT
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# 8. Jalankan server dari hasil build
CMD ["node", "dist/server.cjs"]
