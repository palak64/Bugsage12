import express from 'express';
import aiService from '../services/aiService';

const router = express.Router();

router.post('/predict', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Missing title or description' });
    const severity = await aiService.predictSeverity({ title, description });
    const estimatedTime = await aiService.estimateResolutionTime({ title, description });
    const bugType = await aiService.classifyBugType({ title, description });
    res.json({ severity, estimated_time_hours: estimatedTime, bug_type: bugType });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI prediction failed' });
  }
});

router.post('/summary', async (req, res) => {
  try {
    const summary = await aiService.generateSummary(req.body);
    res.json({ summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI summary failed' });
  }
});

router.post('/duplicates', async (req, res) => {
  try {
    const duplicates = await aiService.findDuplicates(req.body);
    res.json({ duplicates });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI duplicate check failed' });
  }
});

router.post('/priority', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Missing title or description' });
    const priority = await aiService.recommendPriority({ title, description });
    res.json({ priority });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI priority recommendation failed' });
  }
});

router.post('/analysis', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Missing title or description' });
    const severity = await aiService.predictSeverity({ title, description });
    const estimatedTime = await aiService.estimateResolutionTime({ title, description });
    const bugType = await aiService.classifyBugType({ title, description });
    const priority = await aiService.recommendPriority({ title, description });
    const summary = await aiService.generateSummary({ title, description });
    res.json({ 
      severity, 
      estimated_time_hours: estimatedTime, 
      bug_type: bugType,
      priority,
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI analysis failed' });
  }
});

router.get('/test', (req, res) => {
  res.send(" AI Route Working — ECS Deployment Success!");
});

export default router;
