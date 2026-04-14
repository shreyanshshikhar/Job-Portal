import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
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
            <i className="fas fa-user-circle text-white text-4xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-envelope mr-2 text-primary-500"></i>Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Signing in...</>
            ) : (
              <><i className="fas fa-sign-in-alt mr-2"></i> Sign In</>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Create Account
            </Link>
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mt-6">
            <p className="text-xs text-gray-500 text-center font-semibold mb-2">Demo Accounts</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>👤 Seeker: seeker@example.com / pass123</p>
              <p>🏢 Employer: employer@example.com / emp123</p>
              <p>👑 Admin: admin@example.com / admin123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;