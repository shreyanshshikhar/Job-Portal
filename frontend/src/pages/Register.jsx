/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'seeker',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 animate-slideUp">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-user-plus text-white text-4xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join ProWorks today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-user mr-2 text-primary-500"></i>Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-envelope mr-2 text-primary-500"></i>Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-lock mr-2 text-primary-500"></i>Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field"
              placeholder="Min 6 characters"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-check-circle mr-2 text-primary-500"></i>Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="input-field"
              placeholder="Confirm your password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-briefcase mr-2 text-primary-500"></i>I am a
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field"
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer / Company</option>
            </select>
          </div>
          
          {formData.role === 'employer' && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-building mr-2 text-primary-500"></i>Company Name
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field"
                placeholder="Your Company Name"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Creating account...</>
            ) : (
              <><i className="fas fa-user-plus mr-2"></i> Sign Up</>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;