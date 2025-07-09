import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("authorization");
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}