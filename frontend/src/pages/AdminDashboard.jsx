/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    employers: 0,
    seekers: 0
  });
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`),
        axios.get(`${API_URL}/admin/jobs`),
        axios.get(`${API_URL}/admin/users`)
      ]);
      setStats(statsRes.data.stats);
      setJobs(jobsRes.data.jobs);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${API_URL}/admin/jobs/${jobId}`);
        toast.success('Job deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="gradient-bg rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-90">Manage users, jobs, and monitor platform activity</p>
        <p className="text-sm mt-2 opacity-80">
          <i className="fas fa-user-shield mr-1"></i> Welcome, {user?.name}
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'overview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <i className="fas fa-chart-line mr-2"></i> Overview
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'jobs'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <i className="fas fa-briefcase mr-2"></i> Manage Jobs
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'users'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-primary-600'
          }`}
        >
          <i className="fas fa-users mr-2"></i> Manage Users
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fadeIn">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <i className="fas fa-users text-3xl text-blue-500"></i>
              </div>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              <p className="text-gray-600 text-sm">Total Users</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <i className="fas fa-briefcase text-3xl text-green-500"></i>
              </div>
              <h3 className="text-2xl font-bold">{stats.totalJobs}</h3>
              <p className="text-gray-600 text-sm">Total Jobs</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <i className="fas fa-file-alt text-3xl text-purple-500"></i>
              </div>
              <h3 className="text-2xl font-bold">{stats.totalApplications}</h3>
              <p className="text-gray-600 text-sm">Applications</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <i className="fas fa-building text-3xl text-orange-500"></i>
              </div>
              <h3 className="text-2xl font-bold">{stats.employers}</h3>
              <p className="text-gray-600 text-sm">Employers</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <i className="fas fa-user-graduate text-3xl text-pink-500"></i>
              </div>
              <h3 className="text-2xl font-bold">{stats.seekers}</h3>
              <p className="text-gray-600 text-sm">Job Seekers</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Platform Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Total Revenue (Demo)</span>
                <span className="font-bold text-green-600">$0.00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>Jobs Posted This Month</span>
                <span className="font-bold">{jobs.filter(j => new Date(j.createdAt).getMonth() === new Date().getMonth()).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>New Users This Month</span>
                <span className="font-bold">{users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">All Jobs</h2>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-inbox text-4xl mb-2"></i>
                <p>No jobs posted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job._id} className="border rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${job.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {job.active ? 'Active' : 'Closed'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                        <p className="text-gray-500 text-sm mt-1">{job.description.substring(0, 100)}...</p>
                        <p className="text-primary-600 text-sm mt-2">{job.salary}</p>
                        {job.employerId && (
                          <p className="text-xs text-gray-400 mt-1">
                            Posted by: {job.employerId.name} ({job.employerId.email})
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg text-sm font-medium"
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-users text-4xl mb-2"></i>
                <p>No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map(userItem => (
                  <div key={userItem._id} className="border rounded-xl p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{userItem.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            userItem.role === 'admin' ? 'bg-red-100 text-red-700' :
                            userItem.role === 'employer' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {userItem.role.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          <i className="fas fa-envelope mr-1"></i> {userItem.email}
                        </p>
                        {userItem.company && (
                          <p className="text-gray-500 text-sm mt-1">
                            <i className="fas fa-building mr-1"></i> {userItem.company}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Joined: {new Date(userItem.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {userItem.role !== 'admin' && (
                        <button
                          onClick={() => deleteUser(userItem._id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;