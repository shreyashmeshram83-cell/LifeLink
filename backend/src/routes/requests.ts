import express from 'express';
import { supabase } from '../server.js';
import { verifyToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Generate emergency request ID
const generateRequestId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000);
  return `LL-${year}-${String(random).padStart(4, '0')}`;
};

// Get all requests
router.get('/', async (req, res) => {
  try {
    const { status, hospital_id } = req.query;

    let query = supabase.from('emergency_requests').select('*');

    if (status) {
      query = query.eq('status', status);
    }

    if (hospital_id) {
      query = query.eq('hospital_id', hospital_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Create emergency request
router.post('/', verifyToken, async (req, res) => {
  try {
    const { patient_name, blood_group, component, units_required, urgency, hospital_id, contact_number } = req.body;

    if (!patient_name || !blood_group || !hospital_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const requestId = generateRequestId();

    const { data, error } = await supabase
      .from('emergency_requests')
      .insert({
        id: requestId,
        patient_name,
        blood_group,
        component: component || 'Whole Blood',
        units_required,
        urgency: urgency || 'Normal',
        hospital_id,
        contact_number_encrypted: contact_number,
        status: 'VERIFYING',
        created_at: new Date()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Emergency request created',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Get specific request
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Update request status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status required' });
    }

    const { data, error } = await supabase
      .from('emergency_requests')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Request status updated',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Get matched donors for a request
router.get('/:id/matched-donors', async (req, res) => {
  try {
    const { data: request, error: reqError } = await supabase
      .from('emergency_requests')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (reqError) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Get compatible donors
    const { data: donors, error: donorsError } = await supabase
      .from('donors')
      .select('*')
      .eq('blood_group', request.blood_group)
      .eq('active', true)
      .eq('eligibility_status', 'eligible');

    if (donorsError) {
      return res.status(400).json({ error: donorsError.message });
    }

    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matched donors' });
  }
});

export default router;
