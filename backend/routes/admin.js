const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', async(req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            totalJobs: await Job.countDocuments(),
            totalApplications: await Application.countDocuments(),
            employers: await User.countDocuments({ role: 'employer' }),
            seekers: await User.countDocuments({ role: 'seeker' })
        };
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/jobs', async(req, res) => {
    try {
        const jobs = await Job.find().populate('employerId', 'name email company');
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/jobs/:id', async(req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ jobId: req.params.id });
        res.json({ success: true, message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;