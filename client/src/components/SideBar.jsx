import { useEffect, useState } from "react";
import { useNavigate, NavLink  } from "react-router-dom";
import defaultAvatar from "../assets/defaulAvatar.jpg"

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");
  const [user, setUser] = useState({ full_name: "", avatar_url: "" });

  const navigate = useNavigate();

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

  return (
    <div>
      <aside
        className={`fixed z-30 top-0 left-0 h-full w-64 bg-white shadow p-6 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <div className="flex items-center gap-3 mb-8">
          <img
            src={user.avatar_url}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium capitalize truncate">{user.full_name}</span>
        </div>

        <nav className="space-y-1 text-sm">
          <NavLink
            to="/dashboard/profile"
            onClick={() => setActiveItem("profile")}
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer content-center ${
              activeItem === "profile" ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 ${
                activeItem === "profile" ? "fill-current text-gray-700" : ""
              }`}
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
            to="/dashboard/documents"
            onClick={() => setActiveItem("documents")}
            className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer ${
              activeItem === "documents"
                ? "bg-gray-200 font-semibold text-gray-700 "
                : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-6 ${
                activeItem === "documents" ? "fill-current text-gray-700" : ""
              }`}
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
        className="md:hidden fixed top-2 left-2 z-40 bg-white shadow p-1 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
    </div>
  );
}
