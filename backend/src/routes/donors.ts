import express from 'express';
import { supabase } from '../server.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get all donors with filters
router.get('/', async (req, res) => {
  try {
    const { blood_group, available, lat, lng, radius_km } = req.query;

    let query = supabase.from('donors').select('*');

    if (blood_group) {
      query = query.eq('blood_group', blood_group);
    }

    if (available === 'true') {
      query = query.eq('active', true).eq('eligibility_status', 'eligible');
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Filter by distance if lat/lng provided
    if (lat && lng && radius_km) {
      const maxDist = parseFloat(radius_km as string);
      const filteredDonors = data.filter((donor: any) => {
        const dist = Math.sqrt(
          Math.pow(donor.lat - parseFloat(lat as string), 2) +
          Math.pow(donor.lng - parseFloat(lng as string), 2)
        ) * 111; // rough conversion to km
        return dist <= maxDist;
      });
      return res.json(filteredDonors);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

// Get specific donor
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donor' });
  }
});

// Register new donor
router.post('/', verifyToken, async (req, res) => {
  try {
    const { blood_group, lat, lng } = req.body;
    const userId = (req as any).user.userId;

    if (!blood_group) {
      return res.status(400).json({ error: 'Blood group required' });
    }

    const { data, error } = await supabase
      .from('donors')
      .insert({
        user_id: userId,
        blood_group,
        lat,
        lng,
        eligibility_status: 'pending',
        reliability_score: 0
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Donor registered successfully',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register donor' });
  }
});

// Update donor availability
router.put('/:id/availability', verifyToken, async (req, res) => {
  try {
    const { active } = req.body;

    const { data, error } = await supabase
      .from('donors')
      .update({ active, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Availability updated',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// Get donation history
router.get('/:id/donation-history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donation_records')
      .select('*')
      .eq('donor_id', req.params.id)
      .order('donation_date', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation history' });
  }
});

export default router;
