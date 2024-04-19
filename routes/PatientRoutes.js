const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils/utils'); 
const PatientInfo = require('../models/PatientInfo'); 
const SymptomChecklist = require('../models/SymptomChecklist');

// GET Patient Info
router.get('/info', requireAuth, async (req, res) => {
    try {
        const patientInfos = await PatientInfo.find({ userId: req.user._id });
        res.render('patientInfo', { patientInfos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Patient Info
router.post('/info', requireAuth, async (req, res) => {
    if (req.user.role !== 'patient') {
        return res.status(403).send('Access Denied: Only patients can submit information.');
    }

    const patientInfo = new PatientInfo({
        userId: req.user._id,
        ...req.body
    });

    try {
        await patientInfo.save();
        res.redirect('/patient/info');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET Symptom Checklists
router.get('/symptoms', requireAuth, async (req, res) => {
    try {
        const checklists = await SymptomChecklist.find({ userId: req.user._id });
        res.render('symptomChecklists', { checklists });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Symptom Checklist
router.post('/symptoms', requireAuth, async (req, res) => {
    if (req.user.role !== 'patient') {
        return res.status(403).send('Access Denied: Only patients can submit symptoms.');
    }

    const checklist = new SymptomChecklist({
        userId: req.user._id,
        symptoms: req.body.symptoms.split(', ')
    });

    try {
        await checklist.save();
        res.redirect('/patient/symptoms');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
