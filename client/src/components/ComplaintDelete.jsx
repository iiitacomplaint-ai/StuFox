/**
 * ComplaintDelete Component
 * UPDATED: Converted from police crime system to college complaint system
 * UPDATED: Changed API import from citizenapi to userapi
 * UPDATED: Updated cancel functionality (users can cancel, not delete)
 * UPDATED: Added status validation (only 'Submitted' complaints can be cancelled)
 * UPDATED: Improved UI with better messaging for cancellation vs deletion
 * 
 * @description Modal component for users to cancel their complaints (only if status is 'Submitted')
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelComplaint } from '../apicalls/userapi'; // Changed from deleteComplaint to cancelComplaint
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import LoadingPage from './LoadingPage';

const ComplaintDelete = ({ complaint, setDelete, onRefresh }) => {
  const user = useSelector((state) => state.user?.user);
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Check if complaint can be cancelled (only 'Submitted' status)
  const canCancel = complaint.status === 'Submitted';
  
  // Get appropriate messages based on status
  const getMessages = () => {
    if (canCancel) {
      return {
        title: "Cancel Complaint",
        action: "Cancel",
        actionColor: "bg-orange-600 hover:bg-orange-700",
        question: "Are you sure you want to cancel this complaint?",
        warning: "This action cannot be undone.",
        success: "🎉 Complaint cancelled successfully!",
        buttonText: "Cancel Complaint"
      };
    } else {
      return {
        title: "Cannot Cancel Complaint",
        action: "Close",
        actionColor: "bg-gray-600 hover:bg-gray-700",
        question: `This complaint cannot be cancelled because its status is '${complaint.status}'.`,
        warning: "Only 'Submitted' complaints can be cancelled.",
        success: "",
        buttonText: "Close"
      };
    }
  };

  const messages = getMessages();

  const cancelMutation = useMutation({
    mutationFn: (id) => cancelComplaint(id), // Changed from deleteComplaint to cancelComplaint
    onSuccess: (_, id) => {
      toast.success(messages.success);
      // Update cache
      queryClient.setQueryData(['complaints', user?.user_id], old =>
        old ? old.map(c => 
          c.complaint_id === id 
            ? { ...c, status: 'Closed' } // Update status instead of removing
            : c
        ) : []
      );
      queryClient.invalidateQueries(['complaints', user?.user_id]);
      queryClient.invalidateQueries(['dashboard-stats', user?.user_id]);
      
      // Call refresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
      
      setDelete(false);
    },
    onError: (error) => {
      console.error('Cancel complaint error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to cancel complaint');
    },
  });

  const handleCancel = () => {
    if (!canCancel) {
      setDelete(false);
      return;
    }
    setConfirmDelete(true);
  };

  const confirmAndCancel = () => {
    cancelMutation.mutate(complaint.complaint_id);
  };

  const handleClose = () => {
    setDelete(false);
  };

  if (cancelMutation.isPending) {
    return <LoadingPage status="cancelling" message="Cancelling complaint, please wait..." />;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative mx-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
          aria-label="Close"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">{messages.title}</h3>
        
        <div className="mb-4">
          <p className="text-gray-700 font-medium">Complaint: {complaint.title}</p>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{complaint.description}</p>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            complaint.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
            complaint.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
            complaint.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
            complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            Status: {complaint.status}
          </span>
        </div>

        {/* Warning/Cannot Cancel Message */}
        {!canCancel && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm font-medium">{messages.question}</p>
            <p className="text-red-600 text-xs mt-1">{messages.warning}</p>
          </div>
        )}

        {canCancel && (
          <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
            <p className="text-orange-700 text-sm font-medium">⚠️ {messages.question}</p>
            <p className="text-orange-600 text-xs mt-1">{messages.warning}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!confirmDelete ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-sm font-medium transition-colors duration-200"
              >
                Close
              </button>
              {canCancel && (
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md`}
                >
                  Cancel Complaint
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-end gap-3 w-full">
              <div className="flex gap-3 w-full justify-end">
                <button
                  onClick={() => {
                    setConfirmDelete(false);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  No, Keep It
                </button>
                <button
                  onClick={confirmAndCancel}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Yes, Cancel Complaint
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDelete;