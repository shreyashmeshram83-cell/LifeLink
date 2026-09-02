import express from 'express';
import { supabase } from '../server.js';

const router = express.Router();

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [requestsCount, donorsCount, hospitalsCount, donationsToday] = await Promise.all([
      supabase.from('emergency_requests').select('*', { count: 'exact', head: true }),
      supabase.from('donors').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('hospitals').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('donation_records').select('*', { count: 'exact', head: true })
        .gte('donation_date', today.toISOString())
        .eq('status', 'completed')
    ]);

    res.json({
      total_requests: requestsCount.count || 0,
      active_donors: donorsCount.count || 0,
      active_hospitals: hospitalsCount.count || 0,
      donations_today: donationsToday.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Donor metrics
router.get('/donors', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('blood_group, active, eligibility_status')
      .eq('active', true);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const stats = {
      by_blood_group: {},
      eligible: 0,
      ineligible: 0
    } as any;

    data.forEach((donor: any) => {
      stats.by_blood_group[donor.blood_group] = (stats.by_blood_group[donor.blood_group] || 0) + 1;
      if (donor.eligibility_status === 'eligible') stats.eligible++;
      else stats.ineligible++;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donor analytics' });
  }
});

// Request fulfillment rate
router.get('/requests', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('status');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const stats = {
      total: data.length,
      by_status: {}
    } as any;

    data.forEach((req: any) => {
      stats.by_status[req.status] = (stats.by_status[req.status] || 0) + 1;
    });

    const fulfilled = stats.by_status['FULFILLED'] || 0;
    stats.fulfillment_rate = data.length > 0 ? ((fulfilled / data.length) * 100).toFixed(2) : 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request analytics' });
  }
});

export default router;
