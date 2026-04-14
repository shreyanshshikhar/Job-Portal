/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/applications/my-applications`);
      setApplications(data.applications);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="gradient-bg rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-lg opacity-90">Track your job applications and find more opportunities</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <i className="fas fa-briefcase text-3xl text-primary-500 mb-3"></i>
          <h3 className="text-2xl font-bold">{applications.length}</h3>
          <p className="text-gray-600">Total Applications</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <i className="fas fa-eye text-3xl text-green-500 mb-3"></i>
          <h3 className="text-2xl font-bold">
            {applications.filter(a => a.status === 'reviewed').length}
          </h3>
          <p className="text-gray-600">Under Review</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <i className="fas fa-check-circle text-3xl text-purple-500 mb-3"></i>
          <h3 className="text-2xl font-bold">
            {applications.filter(a => a.status === 'shortlisted').length}
          </h3>
          <p className="text-gray-600">Shortlisted</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">My Applications</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-primary-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-inbox text-4xl mb-2"></i>
            <p>No applications yet. Start applying for jobs!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="border rounded-xl p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{app.jobId?.title}</h3>
                    <p className="text-gray-600 text-sm">{app.jobId?.company}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;