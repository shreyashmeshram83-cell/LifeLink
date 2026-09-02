import express from 'express';
import institutionsData from '../data/institutions.json' assert { type: 'json' };
import donorsData from '../data/donors.json' assert { type: 'json' };
import { supabase } from '../server.js';

const router = express.Router();

// Seed hospitals
router.post('/seed-hospitals', async (req, res) => {
  try {
    const hospitals = institutionsData.hospitals.map((h: any) => ({
      id: h.id,
      name: h.name,
      address: h.city,
      lat: h.lat,
      lng: h.lng,
      bed_capacity: h.beds,
      emergency_dept: h.emergency,
      verified: true,
      active: true,
      blood_bank_capacity: 500
    }));

    const { data, error } = await supabase
      .from('hospitals')
      .insert(hospitals);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: `${hospitals.length} hospitals seeded`,
      count: hospitals.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Seeding failed' });
  }
});

// Seed donors
router.post('/seed-donors', async (req, res) => {
  try {
    const donors = donorsData.donors.map((d: any) => ({
      id: d.id,
      blood_group: d.blood_group,
      lat: d.lat,
      lng: d.lng,
      donations_count: d.donations,
      eligibility_status: 'eligible',
      reliability_score: 85 + Math.random() * 15,
      response_rate: 90 + Math.random() * 10,
      no_show_rate: 2 + Math.random() * 5,
      verified: true,
      active: true
    }));

    const { data, error } = await supabase
      .from('donors')
      .insert(donors);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: `${donors.length} donors seeded`,
      count: donors.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Seeding failed' });
  }
});

// Seed blood inventory
router.post('/seed-inventory', async (req, res) => {
  try {
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    // Get all hospitals
    const { data: hospitals, error: hospitalsError } = await supabase
      .from('hospitals')
      .select('id');

    if (hospitalsError) {
      return res.status(400).json({ error: hospitalsError.message });
    }

    const inventory = [];
    hospitals.forEach((hospital: any) => {
      bloodTypes.forEach((bloodType: string) => {
        inventory.push({
          hospital_id: hospital.id,
          blood_group: bloodType,
          units_available: Math.floor(10 + Math.random() * 50),
          units_reserved: Math.floor(Math.random() * 10),
          storage_type: ['Whole Blood', 'RBC', 'Platelets', 'Plasma'][Math.floor(Math.random() * 4)],
          temperature_controlled: true,
          expiry_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
        });
      });
    });

    const { data, error } = await supabase
      .from('blood_inventory')
      .insert(inventory);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: `${inventory.length} inventory records seeded`,
      count: inventory.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Seeding failed' });
  }
});

export default router;
