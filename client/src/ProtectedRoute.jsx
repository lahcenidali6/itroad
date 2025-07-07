import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const ProtectedRoute = ({ allowedRoles }) => {
  let user;
  const token = localStorage.getItem("authorization");
  if (token) {
    user = jwtDecode(token);
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
