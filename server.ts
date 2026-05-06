import express from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { connectMongo, ensureCareerSeeded } from './backend/mongo';
import { registerApiRoutes } from './backend/routes';

async function startServer() {
  const app = express();
  const requestedPort = Number(process.env.PORT || 0);

  app.set('trust proxy', true);
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(mongoSanitize());

  await connectMongo();
  await ensureCareerSeeded();

  registerApiRoutes(app);

  // AI Counselor API
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: messages,
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(requestedPort, '0.0.0.0', () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : requestedPort;
    console.log(`Server running on http://0.0.0.0:${actualPort}`);
  });
}

startServer();
