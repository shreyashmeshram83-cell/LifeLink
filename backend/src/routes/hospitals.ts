import express from 'express';
import { supabase } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('active', true);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Get specific hospital
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
});

// Register new hospital
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, address, lat, lng, contact_person, email, bed_capacity, emergency_dept } = req.body;
    const userId = (req as any).user.userId;

    if (!name || !address) {
      return res.status(400).json({ error: 'Name and address required' });
    }

    const { data, error } = await supabase
      .from('hospitals')
      .insert({
        user_id: userId,
        name,
        address,
        lat,
        lng,
        contact_person,
        email,
        bed_capacity,
        emergency_dept,
        verified: false
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Hospital registered successfully',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register hospital' });
  }
});

// Get hospital inventory
router.get('/:id/inventory', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*')
      .eq('hospital_id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

export default router;
