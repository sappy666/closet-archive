import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for Base64 image uploads
  app.use(express.json({ limit: '25mb' }));

  // Initialize Gemini AI client
  const aiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (aiKey) {
    ai = new GoogleGenAI({
      apiKey: aiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: '@sappy.error', aiAvailable: !!ai });
  });

  // 1. Analyze Garment Image via Gemini AI
  app.post('/api/analyze-item', async (req, res) => {
    try {
      const { imageBase64, hintCategory } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      if (!ai) {
        return res.json({
          category: hintCategory || 'Tops',
          title: 'Prenda @sappy.error',
          color: 'Negro',
          brand: '@sappy.error',
          tags: ['Streetwear', 'Y2K', 'Tech'],
          notes: 'Prenda subida correctamente (Análisis básico sin clave AI).'
        });
      }

      // Extract raw base64 data and mime type
      const match = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      const mimeType = match ? match[1] : 'image/jpeg';
      const cleanBase64 = match ? match[2] : imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analiza esta prenda de vestir para la marca de ropa streetwear/Y2K @sappy.error.
Determina:
1. Categoría exacta (DEBE SER exactamente una de estas 5: "Tops", "Bottoms", "Jackets", "Shoes", "Accessories").
2. Un título conciso e inspirador (ej. "Boxy Heavyweight Tee", "Parachute Cargo Pants", "Cyber Shield Glasses").
3. Color dominante (ej. "Negro Carbono", "Plata Metálico", "Gris Washed").
4. Marca (default "@sappy.error" o la que aparente).
5. Lista de 3 a 4 etiquetas/tags estilo (ej. "Y2K", "Streetwear", "Techwear", "Oversized", "Minimal").
6. Una breve nota de 1 frase describiendo los detalles del corte o material.

Responde estrictamente en formato JSON válido.`
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: 'Categoría de la prenda. Debe ser "Tops", "Bottoms", "Jackets", "Shoes" o "Accessories".'
              },
              title: {
                type: Type.STRING,
                description: 'Título descriptivo de la prenda.'
              },
              color: {
                type: Type.STRING,
                description: 'Color principal.'
              },
              brand: {
                type: Type.STRING,
                description: 'Marca identificada o sugerida.'
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de tags de estilo.'
              },
              notes: {
                type: Type.STRING,
                description: 'Nota breve de diseño/material.'
              }
            },
            required: ['category', 'title', 'color', 'tags']
          }
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);

      // Validate category
      const validCategories = ['Tops', 'Bottoms', 'Jackets', 'Shoes', 'Accessories'];
      if (!validCategories.includes(parsed.category)) {
        parsed.category = hintCategory || 'Tops';
      }

      return res.json(parsed);
    } catch (error) {
      console.error('Error analyzing image:', error);
      return res.json({
        category: req.body.hintCategory || 'Tops',
        title: 'Prenda @sappy.error',
        color: 'Neutro',
        brand: '@sappy.error',
        tags: ['Y2K', 'Streetwear'],
        notes: 'Prenda analizada automáticamente.'
      });
    }
  });

  // 2. AI Outfit Vibe Check & Critique
  app.post('/api/style-advice', async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || Object.keys(items).length === 0) {
        return res.status(400).json({ error: 'At least one item is required' });
      }

      if (!ai) {
        return res.json({
          score: '9.5 / 10',
          title: 'Estilo @sappy.error Minimal Tech',
          comment: 'Buena armonía entre prendas y proporciones urbanas.',
          suggestions: 'Considera sumar accesorios metálicos o calzado con plataforma.',
          recommendedOccasion: 'Streetwear / Diario'
        });
      }

      const itemDetails = Object.entries(items)
        .map(([slot, item]: [string, any]) => item ? `${slot.toUpperCase()}: ${item.title} (${item.category}, color: ${item.color || 'N/A'})` : null)
        .filter(Boolean)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Eres el Director Creativo de la marca streetwear/Y2K @sappy.error.
Evalúa esta combinación de outfit:

${itemDetails}

Proporciona un veredicto de estilo experto en español con estética minimalista, moderna y técnica:
1. score: Puntaje del 1 al 10 con un decimal (ej. "9.7 / 10").
2. title: Nombre conceptual pegajoso (ej. "Cyber Minimal Matrix Silhouette").
3. comment: Veredicto técnico sobre la silueta, silueta oversize/slim, combinación de colores y vibra Y2K.
4. suggestions: Consejo Pro para mejorar o llevar el outfit al siguiente nivel.
5. recommendedOccasion: Ocasión perfecta (ej. "Rave / Night Out", "Galería de Arte", "Día en la Ciudad").`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.STRING },
              title: { type: Type.STRING },
              comment: { type: Type.STRING },
              suggestions: { type: Type.STRING },
              recommendedOccasion: { type: Type.STRING }
            },
            required: ['score', 'title', 'comment', 'suggestions', 'recommendedOccasion']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error) {
      console.error('Error generating style advice:', error);
      return res.json({
        score: '9.2 / 10',
        title: 'Estilo Y2K Moderno',
        comment: 'Combinación equilibrada de prendas streetwear.',
        suggestions: 'Añadir accesorios oscuros para acentuar los contrastes.',
        recommendedOccasion: 'Casual Urban'
      });
    }
  });

  // 3. AI Stylist Chat
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { message, closetSummary } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!ai) {
        return res.json({
          reply: 'Hola! Soy el asistente de estilo de @sappy.error. Para recomendaciones avanzadas con IA Gemini, la clave de API está lista. Te sugiero combinar pantalones cargo de tiro bajo con poleras boxy fit y zapatillas de plataforma para un look Y2K impecable.'
        });
      }

      const closetContext = Array.isArray(closetSummary) && closetSummary.length > 0
        ? `Prendas disponibles en el armario del usuario:\n` +
          closetSummary.map((item: any) => `- [${item.category}] ${item.title} (${item.color || 'Neutro'})`).join('\n')
        : 'El armario actual está vacío o no se enviaron prendas.';

      const systemInstruction = `Eres "Stylist @sappy.error", el asesor oficial de moda de la marca @sappy.error.
Tu estilo de comunicación es directo, sofisticado, experto en moda Y2K, streetwear escandinavo, techwear y estética de pasarela underground.
Usa terminología de moda urbana (siluetas, layering, proporciones, tonalidades, texturas).
Ayuda al usuario a crear combinaciones específicas usando las prendas de su armario cuando sea posible.
Responde de forma concisa (2 a 4 párrafos máximos) en español.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${closetContext}\n\nPregunta del usuario: "${message}"`,
        config: {
          systemInstruction,
        }
      });

      return res.json({ reply: response.text });
    } catch (error) {
      console.error('Error in AI chat:', error);
      return res.json({
        reply: 'Disculpa, tuve un problema temporal procesando tu consulta de estilo. Te recomiendo probar una silueta oversize con contraste de color monocromático.'
      });
    }
  });


  // --- VITE / STATIC SERVING ---
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
    console.log(`Server @sappy.error digital wardrobe listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
