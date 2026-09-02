import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { supabase } from '../server.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user in database
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: uuidv4(),
        email,
        password_hash: hashedPassword,
        phone,
        role: role || 'patient',
        verified: false
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: data.id, email: data.email, role: data.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: data.id, email: data.email, role: data.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get user from database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcryptjs.compare(password, data.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await supabase.from('users').update({ last_login: new Date() }).eq('id', data.id);

    // Generate JWT token
    const token = jwt.sign({ userId: data.id, email: data.email, role: data.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: data.id, email: data.email, role: data.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify JWT middleware
export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

export default router;
