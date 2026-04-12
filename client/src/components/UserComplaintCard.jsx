import React, { useState } from 'react';
import { Eye, XCircle, RefreshCw, TrendingUp, AlertTriangle, Image, Video, FileText, X } from 'lucide-react';
import { toast } from 'react-toastify';

const UserComplaintCard = ({ 
  complaint, 
  onViewDetails, 
  onWithdraw, 
  onReopen, 
  onPriorityChange,
  isWithdrawing,
  isReopening,
  isChangingPriority
}) => {
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(complaint.priority);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const getStatusBadgeColor = (status) => {
    const colors = {
      Submitted: 'bg-yellow-100 text-yellow-800',
      Assigned: 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      Resolved: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
      Escalated: 'bg-red-100 text-red-800',
      Withdrawn: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50',
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const canWithdraw = () => {
    return ['Submitted', 'Assigned'].includes(complaint.status);
  };

  const canReopen = () => {
    return complaint.status === 'Withdrawn';
  };

  const canChangePriority = () => {
    return ['Submitted', 'Assigned', 'In Progress'].includes(complaint.status);
  };

  const handleWithdraw = () => {
    if (!withdrawReason.trim()) {
      toast.error('Please provide a reason for withdrawal');
      return;
    }
    onWithdraw(complaint.complaint_id, withdrawReason);
    setShowWithdrawModal(false);
    setWithdrawReason('');
  };

  const handleReopen = () => {
    if (!reopenReason.trim()) {
      toast.error('Please provide a reason for reopening');
      return;
    }
    onReopen(complaint.complaint_id, reopenReason);
    setShowReopenModal(false);
    setReopenReason('');
  };

  const handlePriorityChange = () => {
    if (selectedPriority === complaint.priority) {
      toast.info('Priority is already set to this value');
      setShowPriorityModal(false);
      return;
    }
    onPriorityChange(complaint.complaint_id, selectedPriority);
    setShowPriorityModal(false);
  };

  const getMediaType = (url) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i)) return 'image';
    if (url.match(/\.(mp4|mov|avi|mkv|webm)$/i)) return 'video';
    return 'other';
  };

  const getMediaIcon = (url) => {
    const type = getMediaType(url);
    if (type === 'image') return <Image className="h-4 w-4" />;
    if (type === 'video') return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const handleMediaClick = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setShowMediaModal(true);
  };

  const mediaUrls = complaint.media_urls || [];

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-white">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
          {/* Complaint Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h4 className="font-semibold text-gray-800 break-words">{complaint.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(complaint.status)}`}>
                {complaint.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority?.toUpperCase()} Priority
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
            
            {/* Media Preview Thumbnails */}
            {mediaUrls.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {mediaUrls.slice(0, 3).map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMediaClick(url)}
                    className="relative group cursor-pointer"
                  >
                    {getMediaType(url) === 'image' ? (
                      <div className="relative">
                        <img
                          src={url}
                          alt={`Media ${idx + 1}`}
                          className="h-12 w-12 object-cover rounded border border-gray-200 hover:border-purple-500 transition-all"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded transition-all flex items-center justify-center">
                          <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : getMediaType(url) === 'video' ? (
                      <div className="relative">
                        <video className="h-12 w-12 object-cover rounded border border-gray-200">
                          <source src={url} />
                        </video>
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded flex items-center justify-center">
                          <Video className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                  </button>
                ))}
                {mediaUrls.length > 3 && (
                  <button
                    onClick={() => handleMediaClick(mediaUrls[3])}
                    className="h-12 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    +{mediaUrls.length - 3}
                  </button>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              <span>ID: #{complaint.complaint_id}</span>
              <span>Category: {complaint.category}</span>
              <span>Created: {new Date(complaint.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={onViewDetails}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>

            {canWithdraw() && (
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={isWithdrawing}
                className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
              </button>
            )}

            {canReopen() && (
              <button
                onClick={() => setShowReopenModal(true)}
                disabled={isReopening}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                {isReopening ? 'Reopening...' : 'Reopen'}
              </button>
            )}

            {canChangePriority() && (
              <button
                onClick={() => setShowPriorityModal(true)}
                disabled={isChangingPriority}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <TrendingUp className="h-4 w-4" />
                Change Priority
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Full View Modal */}
      {showMediaModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <button
              onClick={() => {
                setShowMediaModal(false);
                setSelectedMedia(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            {getMediaType(selectedMedia) === 'image' ? (
              <img
                src={selectedMedia}
                alt="Full view"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : getMediaType(selectedMedia) === 'video' ? (
              <video
                src={selectedMedia}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">This file type cannot be previewed</p>
                <a
                  href={selectedMedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Download File
                </a>
              </div>
            )}
            
            {/* Navigation buttons for multiple media */}
            {mediaUrls.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const currentIndex = mediaUrls.indexOf(selectedMedia);
                    const prevIndex = currentIndex === 0 ? mediaUrls.length - 1 : currentIndex - 1;
                    setSelectedMedia(mediaUrls[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = mediaUrls.indexOf(selectedMedia);
                    const nextIndex = currentIndex === mediaUrls.length - 1 ? 0 : currentIndex + 1;
                    setSelectedMedia(mediaUrls[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Media counter */}
            {mediaUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {mediaUrls.indexOf(selectedMedia) + 1} / {mediaUrls.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Withdraw Complaint</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for withdrawal *
              </label>
              <textarea
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Please explain why you want to withdraw this complaint..."
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Confirm Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Reopen Complaint</h2>
              <button onClick={() => setShowReopenModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for reopening *
              </label>
              <textarea
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Please explain why you want to reopen this complaint..."
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReopenModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReopen}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Reopen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Priority Modal */}
      {showPriorityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Change Priority</h2>
              <button onClick={() => setShowPriorityModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Priority: <span className="font-bold capitalize">{complaint.priority}</span>
              </label>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={selectedPriority === 'low'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="flex-1">
                    <span className="font-medium">Low</span>
                    <p className="text-xs text-gray-500">Minimal impact, can be addressed when time permits</p>
                  </span>
                  <AlertTriangle className="h-5 w-5 text-green-500" />
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={selectedPriority === 'medium'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="h-4 w-4 text-yellow-600"
                  />
                  <span className="flex-1">
                    <span className="font-medium">Medium</span>
                    <p className="text-xs text-gray-500">Moderate impact, should be addressed soon</p>
                  </span>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={selectedPriority === 'high'}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="h-4 w-4 text-red-600"
                  />
                  <span className="flex-1">
                    <span className="font-medium">High</span>
                    <p className="text-xs text-gray-500">Critical impact, requires immediate attention</p>
                  </span>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPriorityModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePriorityChange}
                  disabled={isChangingPriority}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isChangingPriority ? 'Changing...' : 'Change Priority'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserComplaintCard;