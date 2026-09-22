import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { getAllPartnersWithDiscount } from './partner-service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3001;

const app = express();

app.get('/api/partners', async (req, res) => {
  try {
    const partners = await getAllPartnersWithDiscount();
    res.json(partners);
  } catch (err) {
    console.error('Ошибка запроса партнёров:', err.message);
    res.status(500).json({ error: 'Не удалось загрузить список партнёров' });
  }
});

// раздача собранного фронтенда (после npm run build)
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
