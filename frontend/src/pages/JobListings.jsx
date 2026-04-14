import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', location: '', category: 'all' });
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`${API_URL}/jobs?${params}`);
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // FIXED: This now navigates to job details page instead of showing "coming soon"
  const handleApply = (job) => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'seeker') {
      toast.error('Only job seekers can apply for jobs');
      return;
    }
    
    // Navigate to job details page where they can upload resume
    navigate(`/jobs/${job._id}`);
  };

  const categories = ['all', 'Engineering', 'Product', 'Marketing', 'Design', 'Sales', 'HR', 'Finance'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="gradient-bg rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Dream Job</h1>
        <p className="text-lg opacity-90">Discover thousands of opportunities from top companies</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <i className="fas fa-filter text-primary-500"></i> Filter Jobs
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-search mr-1"></i> Search
            </label>
            <input
              type="text"
              placeholder="Job title or company"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-map-marker-alt mr-1"></i> Location
            </label>
            <input
              type="text"
              placeholder="City, state, or remote"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-tag mr-1"></i> Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          <i className="fas fa-briefcase mr-2"></i>
          Found <span className="font-bold text-primary-600">{jobs.length}</span> jobs
        </p>
        <button
          onClick={() => setFilters({ search: '', location: '', category: 'all' })}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          <i className="fas fa-redo-alt mr-1"></i> Reset Filters
        </button>
      </div>
      
      {/* Job Listings */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
          <p className="text-gray-400">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div key={job._id} className="bg-white rounded-2xl shadow-lg p-6 card-hover border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                  <p className="text-primary-600 font-medium">{job.company}</p>
                </div>
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                  <i className="fas fa-building text-white text-xl"></i>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                  <i className="fas fa-map-marker-alt text-primary-500"></i> {job.location}
                </span>
                <span className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-blue-100 text-blue-700">
                  <i className="fas fa-tag text-xs"></i> {job.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div>
                  <p className="text-lg font-bold gradient-text">{job.salary}</p>
                  <p className="text-xs text-gray-400">per year</p>
                </div>
                <button
                  onClick={() => handleApply(job)}
                  className="gradient-bg text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Apply Now <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;