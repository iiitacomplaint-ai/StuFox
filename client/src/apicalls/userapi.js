import api from "../utils/axiosInstance";
import { toast } from "react-toastify";

// ==================== USER PROFILE APIs ====================

// ✅ 1. Get User Profile
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to view profile");
    return { success: false };
  }

  try {
    const response = await api.get(`/user/profile`);
    
    if (response.data.success) {
      return {
        success: true,
        profile: response.data.data
      };
    } else {
      toast.error(response.data.message || "Failed to fetch profile");
      return { success: false };
    }
  } catch (error) {
    console.error("Get profile error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 2. Get Dashboard Statistics
export const getDashboardStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to view dashboard");
    return { success: false };
  }

  try {
    const response = await api.get(`/user/dashboard`);
    
    if (response.data.success) {
      return {
        success: true,
        statistics: response.data.data.statistics,
        recent_complaints: response.data.data.recent_complaints
      };
    } else {
      toast.error(response.data.message || "Failed to fetch dashboard stats");
      return { success: false };
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ==================== COMPLAINT MANAGEMENT APIs ====================

// ✅ 3. Create Complaint
export const createComplaint = async (complaintData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to create complaint");
    return { success: false };
  }

  try {
    const response = await api.post(`/user/complaints`, complaintData);
    
    if (response.data.success) {
      toast.success(response.data.message || "Complaint created successfully!");
      return {
        success: true,
        complaint: response.data.data
      };
    } else {
      toast.error(response.data.message || "Failed to create complaint");
      return { success: false };
    }
  } catch (error) {
    console.error("Create complaint error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 4. Get My Complaints (with filters)
export const getMyComplaints = async ({ status, category, priority, date, page = 1, limit = 10 }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to view complaints");
    return { success: false };
  }

  try {
    const response = await api.get(`/user/complaints`, {
      params: {
        status: status || undefined,
        category: category || undefined,
        priority: priority || undefined,
        date: date || undefined,
        page,
        limit
      }
    });

    if (response.data.success) {
      return {
        success: true,
        complaints: response.data.data,
        pagination: response.data.pagination
      };
    } else {
      toast.error(response.data.message || "Failed to fetch complaints");
      return { success: false };
    }
  } catch (error) {
    console.error("Get complaints error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 5. Get Single Complaint Details
export const getComplaintDetails = async (complaint_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to view complaint details");
    return { success: false };
  }

  try {
    const response = await api.get(`/user/complaints/${complaint_id}`);
    
    if (response.data.success) {
      return {
        success: true,
        complaint: response.data.data
      };
    } else {
      toast.error(response.data.message || "Failed to fetch complaint details");
      return { success: false };
    }
  } catch (error) {
    console.error("Get complaint details error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 6. Get Complaint Status History
export const getComplaintHistory = async (complaint_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to view history");
    return { success: false };
  }

  try {
    const response = await api.get(`/user/complaints/${complaint_id}/history`);
    
    if (response.data.success) {
      return {
        success: true,
        history: response.data.data,
        count: response.data.count
      };
    } else {
      toast.error(response.data.message || "Failed to fetch history");
      return { success: false };
    }
  } catch (error) {
    console.error("Get complaint history error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 7. Cancel Complaint (Only if status is 'Submitted')
export const cancelComplaint = async (complaint_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to cancel complaint");
    return { success: false };
  }

  try {
    const response = await api.put(`/user/complaints/${complaint_id}/cancel`);
    
    if (response.data.success) {
      toast.success(response.data.message || "Complaint cancelled successfully!");
      return {
        success: true,
        complaint: response.data.data
      };
    } else {
      toast.error(response.data.message || "Failed to cancel complaint");
      return { success: false };
    }
  } catch (error) {
    console.error("Cancel complaint error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 8. Reopen Complaint (Only if status is 'Resolved')
export const reopenComplaint = async (complaint_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("You must be logged in to reopen complaint");
    return { success: false };
  }

  try {
    const response = await api.put(`/user/complaints/${complaint_id}/reopen`);
    
    if (response.data.success) {
      toast.success(response.data.message || "Complaint reopened successfully!");
      return {
        success: true,
        complaint: response.data.data
      };
    } else {
      toast.error(response.data.message || "Failed to reopen complaint");
      return { success: false };
    }
  } catch (error) {
    console.error("Reopen complaint error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};