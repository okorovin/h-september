import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import {
  getPartnerTypes,
  getAllPartnersWithDiscount,
  getPartnerById,
  createPartner,
  updatePartner,
} from './partner-service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.get('/api/partner-types', async (req, res) => {
  try {
    const types = await getPartnerTypes();
    res.json(types);
  } catch (err) {
    console.error('Ошибка запроса типов:', err.message);
    res.status(500).json({ error: 'Не удалось загрузить типы партнёров' });
  }
});

app.get('/api/partners', async (req, res) => {
  try {
    const partners = await getAllPartnersWithDiscount();
    res.json(partners);
  } catch (err) {
    console.error('Ошибка запроса партнёров:', err.message);
    res.status(500).json({ error: 'Не удалось загрузить список партнёров' });
  }
});

app.get('/api/partners/:id', async (req, res) => {
  try {
    const partner = await getPartnerById(Number(req.params.id));
    if (partner === null) {
      res.status(404).json({ error: 'Партнёр не найден' });
      return;
    }
    res.json(partner);
  } catch (err) {
    console.error('Ошибка запроса партнёра:', err.message);
    res.status(500).json({ error: 'Не удалось загрузить партнёра' });
  }
});

app.post('/api/partners', async (req, res) => {
  try {
    const partnerId = await createPartner(req.body);
    res.status(201).json({ partner_id: partnerId });
  } catch (err) {
    console.error('Ошибка создания партнёра:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/partners/:id', async (req, res) => {
  try {
    await updatePartner(Number(req.params.id), req.body);
    res.json({ partner_id: Number(req.params.id) });
  } catch (err) {
    console.error('Ошибка обновления партнёра:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
