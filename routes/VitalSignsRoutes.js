const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils/utils');
const VitalSigns = require('../models/vitalsigns');

// Get Vital Signs (Assumes nurse-only access)
router.get('/nurse/vitals', requireAuth, async (req, res) => {
    if (req.user.role !== 'nurse') {
        return res.status(403).send('Access Denied: Only nurses can view vital signs.');
    }

    try {
        const vitals = await VitalSigns.find();
        res.render('vitalSigns', { vitals });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post Vital Signs
router.post('/nurse/vitals', requireAuth, async (req, res) => {
    if (req.user.role !== 'nurse') {
        return res.status(403).send('Access Denied: Only nurses can record vital signs.');
    }

    const vitalSigns = new VitalSigns({
        userId: req.user._id,
        ...req.body
    });

    try {
        await vitalSigns.save();
        res.redirect('/nurse/vitals');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
