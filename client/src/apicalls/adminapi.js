import api from "../utils/axiosInstance";
import { toast } from "react-toastify";

// ==================== WORKER MANAGEMENT ====================

// ✅ 1. Create Worker
export const createWorker = async (workerData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.post(`/admin/createWorker`, workerData);
    if (response.data.success) {
      toast.success(response.data.message || "Worker created successfully.");
      return { success: true, data: response.data.data };
    } else {
      toast.error(response.data.message || "Something went wrong.");
      return { success: false };
    }
  } catch (error) {
    console.error("API error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 2. Get All Workers (with department filter)
export const getWorkers = async ({ department = null, page = 1, limit = 20 }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.get(`/admin/getWorkers`, {
      params: {
        department: department || undefined,
        page,
        limit
      }
    });

    if (response.data.success) {
      return {
        success: true,
        workers: response.data.data,
        count: response.data.count
      };
    } else {
      toast.error(response.data.message || "Failed to fetch workers");
      return { success: false };
    }
  } catch (error) {
    console.error("Error fetching workers:", error);
    toast.error(error.response?.data?.message || "Server error");
    return { success: false };
  }
};

// ✅ 3. Delete Worker
export const deleteWorker = async (user_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.delete(`/admin/deleteWorker/${user_id}`);
    if (response.data.success) {
      toast.success(response.data.message || "Worker deleted successfully.");
      return { success: true };
    } else {
      toast.error(response.data.message || "Something went wrong.");
      return { success: false };
    }
  } catch (error) {
    console.error("API error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ==================== COMPLAINT MANAGEMENT ====================

// ✅ 4. Get All Complaints (with filters)
export const getAllComplaints = async ({ status, category, priority, page = 1, limit = 10 }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.get(`/admin/getAllComplaints`, {
      params: {
        status: status || undefined,
        category: category || undefined,
        priority: priority || undefined,
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
    console.error("Error fetching complaints:", error);
    toast.error(error.response?.data?.message || "Server error");
    return { success: false };
  }
};

// ✅ 5. Assign Complaint to Worker
export const assignComplaint = async (complaint_id, worker_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.post(`/admin/assignComplaint`, {
      complaint_id,
      worker_id
    });

    if (response.data.success) {
      toast.success(response.data.message || "Complaint assigned successfully.");
      return { success: true, data: response.data.data };
    } else {
      toast.error(response.data.message || "Something went wrong.");
      return { success: false };
    }
  } catch (error) {
    console.error("API error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 6. Reassign Complaint to Another Worker
export const reassignComplaint = async (complaint_id, new_worker_id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.put(`/admin/reassignComplaint`, {
      complaint_id,
      new_worker_id
    });

    if (response.data.success) {
      toast.success(response.data.message || "Complaint reassigned successfully.");
      return { success: true, data: response.data.data };
    } else {
      toast.error(response.data.message || "Something went wrong.");
      return { success: false };
    }
  } catch (error) {
    console.error("API error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ✅ 7. Update Complaint Status (Admin Action)
export const updateComplaintStatus = async (complaint_id, new_status) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.put(`/admin/updateComplaintStatus`, {
      complaint_id,
      new_status
    });

    if (response.data.success) {
      toast.success(response.data.message || "Status updated successfully.");
      return { success: true, data: response.data.data };
    } else {
      toast.error(response.data.message || "Something went wrong.");
      return { success: false };
    }
  } catch (error) {
    console.error("API error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(`Error: ${message}`);
    return { success: false };
  }
};

// ==================== AUDIT LOGS ====================

// ✅ 8. Get Audit Logs (with filters)
export const getAuditLogs = async ({ user_id, action, date, page = 1, limit = 20 }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error("Unauthorized. Please log in again.");
    return { success: false };
  }

  try {
    const response = await api.get(`/admin/getAuditLogs`, {
      params: {
        user_id: user_id || undefined,
        action: action || undefined,
        date: date || undefined,
        page,
        limit
      }
    });

    if (response.data.success) {
      return {
        success: true,
        logs: response.data.data,
        pagination: response.data.pagination
      };
    } else {
      toast.error(response.data.message || "Failed to fetch audit logs");
      return { success: false };
    }
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    toast.error(error.response?.data?.message || "Server error");
    return { success: false };
  }
};