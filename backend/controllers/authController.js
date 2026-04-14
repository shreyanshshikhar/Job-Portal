const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async(req, res) => {
    try {
        const { name, email, password, role, company } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        const user = await User.create({ name, email, password, role, company: role === 'employer' ? company : undefined });
        const token = generateToken(user._id);

        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};