import express from 'express';
import { supabase } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*, hospitals(name, address)');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Get inventory for specific hospital
router.get('/hospital/:hospital_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*')
      .eq('hospital_id', req.params.hospital_id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Update blood stock
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { units_available, units_reserved } = req.body;

    const { data, error } = await supabase
      .from('blood_inventory')
      .update({ units_available, units_reserved, last_updated: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Inventory updated',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

// Reserve blood units
router.post('/reserve', verifyToken, async (req, res) => {
  try {
    const { inventory_id, units } = req.body;

    const { data: inventory, error: invError } = await supabase
      .from('blood_inventory')
      .select('*')
      .eq('id', inventory_id)
      .single();

    if (invError) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    if (inventory.units_available < units) {
      return res.status(400).json({ error: 'Insufficient units available' });
    }

    const { data, error } = await supabase
      .from('blood_inventory')
      .update({
        units_available: inventory.units_available - units,
        units_reserved: inventory.units_reserved + units,
        last_updated: new Date()
      })
      .eq('id', inventory_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Blood units reserved',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reserve units' });
  }
});

export default router;
