import { jwtDecode } from "jwt-decode";

const getToken = () => {
  return localStorage.getItem("token");
};

const getRole = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const extractRole = (token) => {
  try {
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

const getUserId = () => {
  try {
    const token = getToken();
    if (!token) return null;

    const decoded = jwtDecode(token);
    return decoded.user_id || null;
  } catch {
    return null;
  }
};

const isValidToken = () => {
  try {
    const token = getToken();
    if (!token) return false;

    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    console.error("Token decode error:", error);
    return false;
  }
};

const clearAuth = () => {
  localStorage.removeItem("token");
};

export {
  getToken,
  getRole,
  extractRole,
  getUserId,
  isValidToken,
  clearAuth,
};