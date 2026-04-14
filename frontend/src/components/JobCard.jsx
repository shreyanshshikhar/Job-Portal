import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, showApplyButton = true, onApply }) => {
  const navigate = useNavigate();
  
  const getCategoryColor = (category) => {
    const colors = {
      Engineering: 'bg-blue-100 text-blue-700',
      Product: 'bg-purple-100 text-purple-700',
      Marketing: 'bg-pink-100 text-pink-700',
      Design: 'bg-green-100 text-green-700',
      Sales: 'bg-orange-100 text-orange-700',
      HR: 'bg-yellow-100 text-yellow-700',
      Finance: 'bg-indigo-100 text-indigo-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 card-hover border border-gray-100 animate-scaleUp">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1 hover:text-primary-600 cursor-pointer" 
              onClick={() => navigate(`/jobs/${job._id}`)}>
            {job.title}
          </h3>
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
        <span className={`inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg ${getCategoryColor(job.category)}`}>
          <i className="fas fa-tag text-xs"></i> {job.category}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div>
          <p className="text-lg font-bold gradient-text">{job.salary}</p>
          <p className="text-xs text-gray-400">per year</p>
        </div>
        {showApplyButton && (
          <button
            onClick={() => onApply ? onApply(job) : navigate(`/jobs/${job._id}`)}
            className="gradient-bg text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            Apply Now <i className="fas fa-arrow-right ml-1"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;