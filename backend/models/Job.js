const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true, enum: ['Engineering', 'Product', 'Marketing', 'Design', 'Sales', 'HR'] },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);