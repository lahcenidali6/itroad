
import { useState, useEffect, useRef } from "react";
import defaultAvatar from "../assets/defaulAvatar.jpg"
import { MdEdit } from "react-icons/md";
import { IoSaveSharp } from "react-icons/io5";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    joinedAt: "",
    avatarUrl: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hovering, setHovering] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: {
            Authorization: localStorage.getItem("authorization"),
          },
        });
        const data = await res.json();
        setProfile({
          fullName: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          joinedAt: data.joined_at || "",
          avatarUrl: data.avatar_url || defaultAvatar,
        });
      } catch (err) {
        setError("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("authorization"),
        },
        body: JSON.stringify({
          full_name: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
        }),
      });
      const result = await res.json();
      if (res.ok && result.data?.[0]) {
        console.log(result.data)
        const updated = result.data[0];
         setProfile({
          fullName: result.data[0].full_name || "",
          email: result.data[0].email || "",
          phone: result.data[0].phone || "",
          location: result.data[0].location || "",
          joinedAt: result.data[0].joined_at || "",
          avatarUrl: result.data[0].avatar_url || defaultAvatar,
        });
        setMessage("Profile updated successfully");
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch {
      setError("Server error");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "itRoadFils");
    formData.append("folder", "avatars");
    try {
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/du5lmgzy1/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await cloudRes.json();

      const updateRes = await fetch(`${API_BASE}/api/users/update/avatar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("authorization"),
        },
        body: JSON.stringify({ avatar_url: data.secure_url}),
      });
      const result = await updateRes.json();
      console.log(result)
      if (updateRes.ok) {
        setProfile((prev) => ({ ...prev, avatarUrl:data.secure_url }));
        setMessage("Avatar updated successfully");
      } else {
        setError("Failed to update avatar");
      }
    } catch {
      setError("Upload failed");
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-3 py-2 bg-[#addaea] text-black rounded hover:bg-[#92cee3] flex flex-nowrap items-center"
        >
          {isEditing ? <IoSaveSharp />: <MdEdit />}
        </button>
      </div>

      <div className="flex items-center gap-6 mb-10">
        <div
          className="relative w-24 h-24"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full"
          />
          {hovering && (
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <span className="text-white text-xs">Change</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold first-letter:uppercase">{profile.fullName}</h2>
          <p className="text-sm text-gray-400">Joined in {new Date(profile.joinedAt).getFullYear()}</p>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        {Object.entries(profile)
          .filter(([key]) => !["joinedAt", "avatarUrl"].includes(key))
          .map(([key, value]) => (
            <div key={key} className="flex px-4 py-3 border-t border-gray-300">
              <div className="w-1/5">
                <span className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              </div>
              <div className="w-4/5">
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="text-sm border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span className="text-sm">{value}</span>
                )}
              </div>
            </div>
          ))}
      </div>

      {message && <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-md z-50">{message}</div>}
      {error && <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-md z-50">{error}</div>}
    </div>
  );
}
