/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    category: 'Engineering',
    salary: '',
    description: '',
    requirements: []
  });
  const [posting, setPosting] = useState(false);
  
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        axios.get(`${API_URL}/jobs/employer/myjobs`),
        axios.get(`${API_URL}/applications/employer-applications`)
      ]);
      setJobs(jobsRes.data.jobs);
      setApplications(appsRes.data.applications);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.location || !newJob.salary || !newJob.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setPosting(true);
    try {
      await axios.post(`${API_URL}/jobs`, newJob);
      toast.success('Job posted successfully!');
      setShowPostModal(false);
      setNewJob({
        title: '',
        location: '',
        category: 'Engineering',
        salary: '',
        description: '',
        requirements: []
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setPosting(false);
    }
  };

  const toggleJobStatus = async (jobId, currentStatus) => {
    try {
      await axios.put(`${API_URL}/jobs/${jobId}/status`, { active: !currentStatus });
      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.put(`${API_URL}/applications/${appId}/status`, { status });
      toast.success(`Application ${status} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const handleViewResume = (application) => {
    setSelectedResume(application);
    setShowResumeModal(true);
  };

  const handleDownloadResume = async (resumeUrl, applicantName) => {
    try {
      const response = await fetch(`${API_URL}${resumeUrl}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${applicantName.replace(/\s/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success('Downloading resume...');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewed: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      hired: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getFileIcon = (resumeUrl) => {
    if (resumeUrl?.includes('.pdf')) return 'fa-file-pdf text-red-500';
    if (resumeUrl?.includes('.doc')) return 'fa-file-word text-blue-500';
    return 'fa-file-alt text-gray-500';
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.active).length,
    totalApplications: applications.length,
    pendingReviews: applications.filter(a => a.status === 'pending').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
            <p className="text-lg opacity-90">Manage your jobs and review candidates</p>
            <p className="text-sm mt-2 opacity-80">
              <i className="fas fa-building mr-1"></i> {user?.company || user?.name}
            </p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <i className="fas fa-plus-circle"></i> Post New Job
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-briefcase text-3xl text-blue-500"></i>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalJobs}</h3>
          <p className="text-gray-600">Jobs Posted</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-check-circle text-3xl text-green-500"></i>
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.activeJobs}</h3>
          <p className="text-gray-600">Active Jobs</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-users text-3xl text-purple-500"></i>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.totalApplications}</h3>
          <p className="text-gray-600">Applications Received</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <i className="fas fa-clock text-3xl text-orange-500"></i>
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.pendingReviews}</h3>
          <p className="text-gray-600">Need Review</p>
        </div>
      </div>
      
      {/* My Jobs Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <i className="fas fa-briefcase text-blue-500"></i> My Job Listings
        </h2>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-inbox text-4xl mb-2"></i>
            <p>No jobs posted yet. Click "Post New Job" to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="border rounded-xl p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${job.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {job.active ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{job.location} • {job.category}</p>
                    <p className="text-gray-500 text-sm line-clamp-1">{job.description}</p>
                    <p className="text-blue-600 font-semibold text-sm mt-2">{job.salary}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleJobStatus(job._id, job.active)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        job.active 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {job.active ? 'Close Job' : 'Open Job'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Applications Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
          <i className="fas fa-users text-blue-500"></i> Recent Applications
          {applications.length > 0 && (
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {applications.length} total
            </span>
          )}
        </h2>
        
        {applications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-user-friends text-4xl mb-2"></i>
            <p>No applications yet. When candidates apply, they'll appear here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="border rounded-xl p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-blue-600 text-sm"></i>
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">{app.seekerName}</h3>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-1">
                      <i className="fas fa-briefcase mr-1 text-gray-400"></i>
                      Applied for: <span className="font-medium text-blue-600">{app.jobId?.title}</span>
                    </p>
                    
                    {app.seekerEmail && (
                      <p className="text-gray-500 text-sm mb-1">
                        <i className="fas fa-envelope mr-1 text-gray-400"></i>
                        {app.seekerEmail}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-1">
                      <i className="fas fa-calendar-alt mr-1"></i>
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    
                    {app.coverLetter && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          <i className="fas fa-comment"></i> Cover Letter:
                        </p>
                        <p className="text-sm text-gray-600">{app.coverLetter}</p>
                      </div>
                    )}
                    
                    {app.resumeUrl && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewResume(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                        >
                          <i className={`fas ${getFileIcon(app.resumeUrl)}`}></i>
                          View Resume
                        </button>
                        <button
                          onClick={() => handleDownloadResume(app.resumeUrl, app.seekerName)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                        >
                          <i className="fas fa-download"></i>
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                      className="text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">📋 Pending</option>
                      <option value="reviewed">👀 Reviewed</option>
                      <option value="shortlisted">⭐ Shortlisted</option>
                      <option value="rejected">❌ Rejected</option>
                      <option value="hired">✅ Hired</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Post a New Job</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Senior React Developer"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Remote, New York, NY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={newJob.category}
                    onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range *
                </label>
                <input
                  type="text"
                  required
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., $80k - $100k"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  rows="5"
                  required
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={posting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {posting ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i> Posting...</>
                ) : (
                  <><i className="fas fa-paper-plane mr-2"></i> Post Job</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Resume Preview Modal */}
      {showResumeModal && selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Resume Preview</h3>
                <p className="text-sm text-gray-600">
                  {selectedResume.seekerName} - Applied for {selectedResume.jobId?.title}
                </p>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <div className="bg-white rounded-lg shadow-lg p-2">
                <iframe
                  src={`${API_URL}${selectedResume.resumeUrl}?token=${localStorage.getItem('token')}`}
                  title="Resume Viewer"
                  className="w-full h-[70vh] rounded-lg"
                  frameBorder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <div className="text-sm text-gray-500">
                <i className="fas fa-shield-alt mr-1"></i>
                Secure document - Only visible to you
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleDownloadResume(selectedResume.resumeUrl, selectedResume.seekerName);
                    setShowResumeModal(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition"
                >
                  <i className="fas fa-download mr-2"></i> Download Resume
                </button>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;