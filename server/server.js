require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connect = require('./db');
const auth = require('./middleware/auth');
const crud = require('./routes/crud');
const { Appliance, Technician, Maintenance } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appliances', auth, crud(Appliance, { search: ['name', 'brand', 'location'], filters: ['category'] }));
app.use('/api/technicians', auth, crud(Technician, { search: ['name', 'specialty'], filters: ['specialty'] }));
app.use('/api/repairs', auth, require('./routes/repairs'));
app.use('/api/maintenance', auth, crud(Maintenance, { populate: 'appliance', search: ['title', 'type'], sort: '-date' }));
app.use('/api/dashboard', auth, require('./routes/dashboard'));

app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  if (err.code === 11000) return res.status(409).json({ message: 'Already exists' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
connect().then(async (inMemory) => {
  if (inMemory) await require('./seed')();
  app.listen(PORT, () => console.log(`✔ API running → http://localhost:${PORT}`));
}).catch((e) => { console.error('DB error:', e); process.exit(1); });
