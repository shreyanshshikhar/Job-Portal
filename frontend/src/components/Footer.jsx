import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <i className="fas fa-briefcase text-white text-xl"></i>
              </div>
              <span className="font-bold text-2xl">ProWorks</span>
            </div>
            <p className="text-gray-400 text-sm">
              Find your dream job or hire the best talent. Connect with opportunities worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link></li>
              <li><a href="#" className="hover:text-white transition">Career Advice</a></li>
              <li><a href="#" className="hover:text-white transition">Resume Tips</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Employers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
              <li><a href="#" className="hover:text-white transition">Browse Candidates</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li><i className="fas fa-envelope mr-2"></i> support@proworks.com</li>
              <li><i className="fas fa-phone mr-2"></i> +1 (555) 123-4567</li>
              <li><i className="fab fa-twitter mr-2"></i> @proworks</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 ProWorks. All rights reserved. Built with <i className="fas fa-heart text-red-500"></i> for job seekers and employers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;