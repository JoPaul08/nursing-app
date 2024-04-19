// routes/authRoutes.js
const { Router } = require('express');
const router = Router();
require('dotenv').config();
const User = require('../models/user'); 
const { createToken } = require('../utils/utils');

// Sign-up Route
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 }); 
        res.status(201).json({ user: user._id });
    } catch (ex) {
        res.status(400).json({ error: ex.message });
    }
});

// Login Route
router.get("/login", (req, res) => res.render("login"));

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password); 
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ user: user._id });
    } catch (ex) {
        res.status(401).json({ error: 'Authentication failed' });
    }
});

module.exports = router;
