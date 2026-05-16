import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/generate-strategy', async (req, res) => {
    try {
      const { examType, duration, questionCount, difficulty } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        Actúa como un experto en pedagogía y técnicas de estudio. 
        El usuario tiene un examen de tipo "${examType}" con una duración de ${duration} minutos y un total de ${questionCount} preguntas.
        La dificultad percibida es "${difficulty}".
        
        Proporciona:
        1. Una distribución detallada del tiempo paso a paso (minutos por sección).
        2. 5 consejos estratégicos específicos para este tipo de examen.
        3. Una técnica de manejo de nervios rápida.
        
        Responde en formato JSON puro con la siguiente estructura:
        {
          "distribution": [
            { "phase": "Lectura inicial", "minutes": number, "description": "string" },
            ...
          ],
          "tips": ["string", "string", ...],
          "stressTechnique": { "name": "string", "steps": ["string", ...] }
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (!text) throw new Error('No response from AI');
      
      res.json(JSON.parse(text));
    } catch (error) {
      console.error('Error in strategy generation:', error);
      res.status(500).json({ error: 'Failed to generate strategy' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
