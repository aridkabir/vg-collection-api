import * as authService from '../services/authService.js';

export async function signup(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await authService.signup(email, password);

    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await authService.login(email, password);

    res.json(user);
  } catch (error) {
    next(error);
  }
}