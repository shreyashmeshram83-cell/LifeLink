import express from 'express';
import { supabase } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Admin middleware
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, phone, role, verified, created_at');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Verify user
router.put('/users/:id/verify', verifyToken, isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ verified: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'User verified',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

// Get audit logs
router.get('/audit-logs', verifyToken, isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// System health
router.get('/system-health', verifyToken, isAdmin, async (req, res) => {
  try {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      api: 'operational'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system health' });
  }
});

export default router;
