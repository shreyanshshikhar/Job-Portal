const express = require('express');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        let query = { active: true };
        if (req.query.search) query.$or = [{ title: { $regex: req.query.search, $options: 'i' } }, { company: { $regex: req.query.search, $options: 'i' } }];
        if (req.query.location) query.location = { $regex: req.query.location, $options: 'i' };
        if (req.query.category && req.query.category !== 'all') query.category = req.query.category;
        const jobs = await Job.find(query).sort('-createdAt');
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', protect, authorize('employer'), async(req, res) => {
    try {
        req.body.employerId = req.user.id;
        req.body.company = req.user.company;
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id/status', protect, authorize('employer', 'admin'), async(req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        if (req.user.role !== 'admin' && job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        job.active = req.body.active;
        await job.save();
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/employer/myjobs', protect, authorize('employer'), async(req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user.id });
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;