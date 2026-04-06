/**
 * ComplaintCard Component
 * UPDATED: Converted from police crime system to college complaint system
 * UPDATED: Removed police/inspector specific logic
 * UPDATED: Added complaint status tracking for user/worker/admin roles
 * UPDATED: Simplified status configurations
 * UPDATED: Added role-based action buttons
 * 
 * @description Displays complaint details with role-specific actions
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ViewFullComplaint from './ViewFullComplaint';
import ComplaintDelete from './ComplaintDelete';
import AssignWorker from './AssignWorker';
import UpdateStatus from './UpdateStatus';
import AddRemark from './AddRemark';
import { toast } from 'react-toastify';

const ComplaintCard = ({ complaint, onRefresh }) => {
  const [viewFull, setViewFull] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAssignWorker, setShowAssignWorker] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showAddRemark, setShowAddRemark] = useState(false);
  
  const user = useSelector(state => state.user.user);
  const userRole = user?.role; // 'user', 'worker', or 'admin'

  // Normalize status for display
  const normalizedStatus = complaint.status;
  
  // Status configuration for styling
  const statusConfig = {
    'Submitted': { 
      bg: 'bg-gray-50', 
      text: 'text-gray-800', 
      border: 'border-gray-200', 
      icon: '📝', 
      badge: 'bg-gray-100 text-gray-800',
      description: 'Complaint submitted and waiting for assignment'
    },
    'Assigned': { 
      bg: 'bg-blue-50', 
      text: 'text-blue-800', 
      border: 'border-blue-200', 
      icon: '👤', 
      badge: 'bg-blue-100 text-blue-800',
      description: 'Worker assigned to your complaint'
    },
    'In Progress': { 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-800', 
      border: 'border-yellow-200', 
      icon: '🛠️', 
      badge: 'bg-yellow-100 text-yellow-800',
      description: 'Worker is working on your complaint'
    },
    'Resolved': { 
      bg: 'bg-green-50', 
      text: 'text-green-800', 
      border: 'border-green-200', 
      icon: '✅', 
      badge: 'bg-green-100 text-green-800',
      description: 'Complaint has been resolved'
    },
    'Closed': { 
      bg: 'bg-purple-50', 
      text: 'text-purple-800', 
      border: 'border-purple-200', 
      icon: '🔒', 
      badge: 'bg-purple-100 text-purple-800',
      description: 'Complaint is closed'
    },
    'Escalated': { 
      bg: 'bg-red-50', 
      text: 'text-red-800', 
      border: 'border-red-200', 
      icon: '⚠️', 
      badge: 'bg-red-100 text-red-800',
      description: 'Complaint has been escalated'
    }
  };

  const status = statusConfig[normalizedStatus] || {
    bg: 'bg-gray-50', 
    text: 'text-gray-800', 
    border: 'border-gray-200', 
    icon: 'ℹ️', 
    badge: 'bg-gray-100 text-gray-800',
    description: 'Status unknown'
  };

  // Priority configuration
  const priorityConfig = {
    'high': { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
    'medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' },
    'low': { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' }
  };

  const priority = priorityConfig[complaint.priority] || priorityConfig['medium'];

  // Helper function to check if user can cancel complaint
  const canCancel = () => {
    return userRole === 'user' && complaint.status === 'Submitted';
  };

  // Helper function to check if admin can assign complaint
  const canAssign = () => {
    return userRole === 'admin' && complaint.status === 'Submitted' && !complaint.assigned_to;
  };

  // Helper function to check if admin can reassign
  const canReassign = () => {
    return userRole === 'admin' && complaint.assigned_to && complaint.status !== 'Closed';
  };

  // Helper function to check if worker can update status
  const canUpdateStatus = () => {
    if (userRole !== 'worker') return false;
    const allowedStatuses = ['Assigned', 'In Progress', 'Escalated'];
    return allowedStatuses.includes(complaint.status);
  };

  // Helper function to check if worker can add remark
  const canAddRemark = () => {
    return userRole === 'worker' && complaint.assigned_to === user?.user_id;
  };

  // Helper function to check if admin can update status
  const canAdminUpdateStatus = () => {
    return userRole === 'admin' && complaint.status !== 'Closed';
  };

  // Get next status options based on current status
  const getNextStatusOptions = () => {
    const statusFlow = {
      'Submitted': ['Assigned'],
      'Assigned': ['In Progress'],
      'In Progress': ['Resolved', 'Escalated'],
      'Resolved': ['Closed'],
      'Escalated': ['In Progress']
    };
    return statusFlow[complaint.status] || [];
  };

  return (
    <div className={`border rounded-lg overflow-hidden mb-6 ${status.border} ${status.bg} transition-all hover:shadow-lg`}>
      {/* Modals */}
      {viewFull && (
        <ViewFullComplaint
          complaint={complaint}
          setViewFull={setViewFull}
          onRefresh={onRefresh}
        />
      )}
      
      {showDelete && (
        <ComplaintDelete
          complaint={complaint}
          setDelete={setShowDelete}
          onRefresh={onRefresh}
        />
      )}
      
      {showAssignWorker && (
        <AssignWorker
          complaint={complaint}
          setAssignOff={setShowAssignWorker}
          onRefresh={onRefresh}
        />
      )}
      
      {showUpdateStatus && (
        <UpdateStatus
          complaint={complaint}
          setShowUpdateStatus={setShowUpdateStatus}
          onRefresh={onRefresh}
          nextStatuses={getNextStatusOptions()}
        />
      )}
      
      {showAddRemark && (
        <AddRemark
          complaint={complaint}
          setShowAddRemark={setShowAddRemark}
          onRefresh={onRefresh}
        />
      )}

      {/* Main Card Content */}
      <div className="p-5">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${priority.bg} ${priority.text}`}>
                {priority.icon} {complaint.priority.toUpperCase()} Priority
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800`}>
                {complaint.category}
              </span>
            </div>
            <p className="mt-2 text-gray-600 line-clamp-2">{complaint.description}</p>
          </div>

          <div className="flex flex-col items-end gap-1 min-w-[140px]">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${status.badge}`}>
              <span>{status.icon}</span>
              {normalizedStatus}
            </span>
            <span className="text-xs text-gray-500">
              Created: {new Date(complaint.created_at).toLocaleDateString()}
            </span>
            {complaint.assigned_to && (
              <span className="text-xs text-gray-500">
                Assigned to: {complaint.worker_name || `Worker #${complaint.assigned_to}`}
              </span>
            )}
          </div>
        </div>

        {/* Worker Remark Section */}
        {complaint.remark && (
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 rounded-r p-3">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">Worker's Remark</h4>
                <p className="text-sm text-blue-700 mt-1">{complaint.remark}</p>
              </div>
            </div>
          </div>
        )}

        {/* Media Section */}
        {complaint.media_urls && complaint.media_urls.length > 0 && (
          <div className="mt-4 flex gap-2">
            <span className="text-sm text-gray-500">📎 {complaint.media_urls.length} attachment(s)</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">
            Complaint ID: #{complaint.complaint_id}
          </span>

          <div className="flex flex-wrap gap-2">
            {/* View Details Button - All roles */}
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1"
              onClick={() => setViewFull(true)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>

            {/* Cancel Complaint - User only, Submitted status */}
            {canCancel() && (
              <button 
                onClick={() => setShowDelete(true)} 
                className="px-4 py-2 bg-white hover:bg-gray-50 text-red-600 border border-red-300 text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1"
              >
                ❌ Cancel Complaint
              </button>
            )}

            {/* Assign Worker - Admin only, Submitted status */}
            {canAssign() && (
              <button 
                onClick={() => setShowAssignWorker(true)} 
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1"
              >
                👷 Assign Worker
              </button>
            )}

            {/* Reassign Worker - Admin only, Assigned complaints */}
            {canReassign() && (
              <button 
                onClick={() => setShowAssignWorker(true)} 
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1"
              >
                🔄 Reassign Worker
              </button>
            )}

            {/* Update Status - Worker only */}
            {canUpdateStatus() && (
              <button 
                onClick={() => setShowUpdateStatus(true)} 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1"
              >
                📊 Update Status
              </button>
            )}

            {/* Add Remark - Worker only */}
            {canAddRemark() && (
              <button 
                onClick={() => setShowAddRemark(true)} 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1"
              >
                💬 Add Remark
              </button>
            )}

            {/* Admin Status Update */}
            {canAdminUpdateStatus() && (
              <button 
                onClick={() => setShowUpdateStatus(true)} 
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1"
              >
                🔧 Change Status
              </button>
            )}
          </div>
        </div>

        {/* Status Info Text */}
        <div className="mt-3 text-xs text-gray-400">
          {status.description}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;