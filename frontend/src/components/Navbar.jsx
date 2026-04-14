/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center transform group-hover:scale-105 transition">
              <i className="fas fa-briefcase text-white text-xl"></i>
            </div>
            <span className="font-bold text-2xl tracking-tight">
              Shreyansh<span className="gradient-text">Works</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-600 hover:text-primary-600 transition font-medium">
              Browse Jobs
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition font-medium">
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <i className="fas fa-user-circle text-primary-600"></i>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full">
                    {user.role === 'seeker' ? 'Job Seeker' : user.role === 'employer' ? 'Employer' : 'Admin'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="text-primary-600 font-medium hover:text-primary-700 px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="gradient-bg text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideIn">
            <div className="flex flex-col space-y-3">
              <Link to="/jobs" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg">
                Browse Jobs
              </Link>
              {user && (
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg">
                  Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={onLogout}
                  className="text-red-600 px-3 py-2 text-left rounded-lg"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-primary-600 px-3 py-2 rounded-lg">
                    Sign In
                  </Link>
                  <Link to="/register" className="gradient-bg text-white px-3 py-2 rounded-lg text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;