import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingPage from "./LoadingPage";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token, isAuthenticated } = useSelector(
    (state) => state.user
  );

  if (!isAuthenticated || !user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (
    token === "null" ||
    token === "undefined" ||
    token.split(".").length !== 3
  ) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/landingpage" replace />;
  }

  return children;
};

export default ProtectedRoute;