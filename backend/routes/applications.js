const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Apply for job (seeker with resume upload)
router.post('/apply', protect, authorize('seeker'), upload.single('resume'), async(req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        // FIXED: No optional chaining - use traditional check
        const fileName = req.file ? req.file.filename : 'No file uploaded';
        console.log('Application received:', {
            jobId: jobId,
            seekerId: req.user.id,
            fileName: fileName
        });

        // Check if job exists and is active
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (!job.active) {
            return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
        }

        // Check if already applied
        const existingApp = await Application.findOne({ jobId, seekerId: req.user.id });
        if (existingApp) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }

        // Check if resume was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload your resume' });
        }

        // Create resume URL
        const resumeUrl = `/uploads/${req.file.filename}`;

        // Create application
        const application = await Application.create({
            jobId,
            seekerId: req.user.id,
            seekerName: req.user.name,
            seekerEmail: req.user.email,
            resumeUrl,
            coverLetter: coverLetter || '',
            status: 'pending',
            appliedAt: new Date()
        });

        // Populate job details for response
        const populatedApp = await Application.findById(application._id).populate('jobId');

        console.log(`Application created: ${application._id} for job ${job.title}`);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: populatedApp
        });

    } catch (error) {
        console.error('Application error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get my applications (seeker)
router.get('/my-applications', protect, authorize('seeker'), async(req, res) => {
    try {
        const applications = await Application.find({ seekerId: req.user.id })
            .populate('jobId')
            .sort('-appliedAt');
        res.json({ success: true, applications });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get applications for employer jobs (employer can see resumes)
router.get('/employer-applications', protect, authorize('employer'), async(req, res) => {
    try {
        // Get all jobs posted by this employer
        const jobs = await Job.find({ employerId: req.user.id });
        const jobIds = jobs.map(job => job._id);

        // Get all applications for those jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('jobId')
            .sort('-appliedAt');

        // Add full resume URL for each application
        const applicationsWithFullUrl = applications.map(app => {
            const appObj = app.toObject();
            if (appObj.resumeUrl) {
                appObj.fullResumeUrl = `http://localhost:5000${appObj.resumeUrl}`;
            }
            return appObj;
        });

        res.json({ success: true, applications: applicationsWithFullUrl });
    } catch (error) {
        console.error('Error fetching employer applications:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update application status (employer)
router.put('/:id/status', protect, authorize('employer'), async(req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Verify employer owns this job
        if (application.jobId.employerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
        }

        application.status = status;
        await application.save();

        res.json({ success: true, application });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Download resume (employer or admin)
router.get('/resume/:filename', protect, async(req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        // Check authorization - only employer who owns the job or admin can download
        const application = await Application.findOne({ resumeUrl: `/uploads/${filename}` }).populate('jobId');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        const isEmployer = req.user.role === 'employer' && application.jobId.employerId.toString() === req.user.id;
        const isAdmin = req.user.role === 'admin';
        const isOwner = req.user.id === application.seekerId.toString();

        if (!isEmployer && !isAdmin && !isOwner) {
            return res.status(403).json({ success: false, message: 'Not authorized to download this resume' });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Error downloading resume:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;