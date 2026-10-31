const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const sign = (u) => ({
  token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u._id, name: u.name, email: u.email },
});
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e || '');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!emailOk(email)) return res.status(400).json({ message: 'Enter a valid email' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'This email is already registered' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json(sign(user));
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!emailOk(email) || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Wrong email or password' });
    res.json(sign(user));
  } catch (e) { next(e); }
});

module.exports = router;
