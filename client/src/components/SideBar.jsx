import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import defaultAvatar from "../assets/defaulAvatar.jpg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ full_name: "", avatar_url: "" });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authorization"),
          },
        });

        const data = await res.json();
        setUser({
          full_name: data.full_name || "User",
          avatar_url: data.avatar_url || defaultAvatar,
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  function handleLogOut() {
    localStorage.removeItem("authorization");
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <aside
        className={`fixed  z-30 top-0 left-0 h-full w-64 bg-white shadow p-6 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <button
          className="md:hidden absolute  top-1 right-1 z-40 bg-white  p-1 rounded"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <TbLayoutSidebarFilled size={18} />
        </button>
        <div className="flex items-center gap-3 mb-8">
          <img
            src={user.avatar_url}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium capitalize truncate">
            {user.full_name}
          </span>
        </div>

        <nav className="space-y-1 text-sm">
          <NavLink
            onClick={() => setSidebarOpen(false)}
            to="/dashboard/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer content-center ${
              isActive("/dashboard/profile") || isActive("/dashboard")
                ? "bg-gray-200 font-semibold text-gray-700"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={
                isActive("/dashboard/profile") || isActive("/dashboard")
                  ? "currentColor"
                  : "none"
              }
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Profile
          </NavLink>

          <NavLink
            onClick={() => setSidebarOpen(false)}
            to="/dashboard/documents"
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer ${
              isActive("/dashboard/documents")
                ? "bg-gray-200 font-semibold text-gray-700"
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isActive("/dashboard/documents") ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            Documents
          </NavLink>

          <div
            onClick={handleLogOut}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            Logout
          </div>
        </nav>
      </aside>
      <button
        className={`md:hidden absolute  z-40 bg-white  p-1 rounded ${
          sidebarOpen ? "hidden" : "block"
        }`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <TbLayoutSidebarFilled size={20} />
      </button>
    </div>
  );
}
