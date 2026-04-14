const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seekerName: {
        type: String,
        required: true
    },
    seekerEmail: {
        type: String,
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);