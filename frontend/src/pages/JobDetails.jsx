import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchJob();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/jobs/${id}`);
      setJob(data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'seeker') {
      toast.error('Only job seekers can apply');
      return;
    }
    
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }
    
    setApplying(true);
    
    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/applications/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('Application submitted successfully!');
        setShowApplyModal(false);
        setCoverLetter('');
        setResume(null);
      }
    } catch (error) {
      console.error('Application error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary-600"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/jobs')}
        className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center gap-2"
      >
        <i className="fas fa-arrow-left"></i> Back to Jobs
      </button>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="gradient-bg p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex gap-4 text-white/90">
                <span><i className="fas fa-building mr-1"></i> {job.company}</span>
                <span><i className="fas fa-map-marker-alt mr-1"></i> {job.location}</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
              <span className="font-bold">{job.salary}</span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
              <i className="fas fa-tag"></i> {job.category}
            </span>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <i className="fas fa-align-left text-primary-500"></i> Job Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>
          
          <button
            onClick={() => {
              if (!user) {
                toast.error('Please login to apply');
                navigate('/login');
              } else if (user.role !== 'seeker') {
                toast.error('Only job seekers can apply');
              } else {
                setShowApplyModal(true);
              }
            }}
            className="btn-primary w-full"
          >
            <i className="fas fa-paper-plane mr-2"></i> Apply Now
          </button>
        </div>
      </div>
      
      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Apply for {job.title}</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-user mr-1"></i> Your Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-envelope mr-1"></i> Your Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-file-alt mr-1"></i> Cover Letter (Optional)
                </label>
                <textarea
                  rows="4"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="input-field"
                  placeholder="Tell us why you're a great fit..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-file-pdf mr-1"></i> Upload Resume *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setResume(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
              </div>
              
              <button
                type="submit"
                disabled={applying}
                className="btn-primary w-full disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;