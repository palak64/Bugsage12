import express from 'express';
import dotenv from 'dotenv';
import pino from 'pino';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import aiService from './services/aiService';
import aiRoutes from './routes/aiRoutes';
import analyticsRoutes from './routes/analytics';

dotenv.config();
console.log("Gemini API Key Loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const BUGS_FILE = path.join(__dirname, '../data/bugs.json');
const logger = pino();
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Bug schema
const BugSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string().optional()
});

// Load bugs from file
function loadBugs() {
  try {
    const data = fs.readFileSync(BUGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save bugs to file
function saveBugs(bugs: any[]) {
  fs.writeFileSync(BUGS_FILE, JSON.stringify(bugs, null, 2));
}

// CRUD endpoints
app.get('/api/bugs', (req, res) => {
  res.json(loadBugs());
});

app.post('/api/bugs', (req, res) => {
  const parse = BugSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid bug format' });
  const bugs = loadBugs();
  bugs.push(parse.data);
  saveBugs(bugs);
  res.status(201).json(parse.data);
});

app.put('/api/bugs/:id', (req, res) => {
  const bugs = loadBugs();
  const idx = bugs.findIndex((b: any) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Bug not found' });
  const parse = BugSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid bug format' });
  bugs[idx] = parse.data;
  saveBugs(bugs);
  res.json(parse.data);
});

app.delete('/api/bugs/:id', (req, res) => {
  const bugs = loadBugs();
  const idx = bugs.findIndex((b: any) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Bug not found' });
  const deleted = bugs.splice(idx, 1);
  saveBugs(bugs);
  res.json(deleted[0]);
});



// AI endpoints
app.use('/api/ai', aiRoutes);

// Analytics endpoints
app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on http://0.0.0.0:${PORT}`);
});

