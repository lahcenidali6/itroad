import { useState, useEffect } from "react";
import { MdEditDocument } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoCloudDownload } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import Loader from "../components/Loader";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
    file: null,
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDocuments();
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

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/users/documents`, {
        headers: { Authorization: localStorage.getItem("authorization") },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDocuments(data || []);
    } catch {
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/api/users/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: localStorage.getItem("authorization") },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessage(data.message);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch {
      setError("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    setFormData({ ...formData, file });
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", formData.file);
      form.append("upload_preset", "itRoadFils");
      form.append("folder", "documents");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/du5lmgzy1/raw/upload`,
        {
          method: "POST",
          body: form,
        }
      );
      const cloudData = await cloudRes.json();

      const fileUrl = cloudData.secure_url;
      const fileId = cloudData.public_id;
      if (!fileId) throw new Error("Failed to upload the file");

      const res = await fetch(`${API_BASE}/api/users/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("authorization"),
        },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          file_url: fileUrl,
          file_id: fileId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add document");
      const data = await res.json();

      setMessage(data.message);
      setShowModal(false);
      fetchDocuments();
      setFormData({ name: "", status: "Active", file: null });
    } catch {
      setError("Error adding document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {!loading && (
        <div className="flex-1 h-screen overflow-y-auto p-6 md:p-10">
          <div className="flex justify-between mb-6">
            <h3 className="text-2xl font-semibold">Documents</h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 bg-[#addaea] text-black rounded hover:bg-[#92cee3] flex items-center gap-1"
            >
              <MdEditDocument />
            </button>
          </div>

          {documents.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="min-w-full text-sm bg-white border-gray-200">
                <thead>
                  <tr className="text-black text-left">
                    <th className="px-6 py-4 font-medium">Document Name</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Last Updated</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-t border-gray-200">
                      <td className="px-6 py-4 text-gray-900 first-letter:uppercase">
                        {doc.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-gray-100 text-gray-800 rounded-lg px-4 py-1 text-sm">
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(doc.last_updated).toISOString().split("T")[0]}
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-4 text-sm">
                        <a
                          href={doc.file_url.replace("/upload/", "/upload/fl_attachment/")}
                          className="text-gray-700"
                          download
                        >
                          <IoCloudDownload size={20} />
                        </a>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700"
                        >
                          <FaEye size={20} />
                        </a>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className={`text-red-500 ${deletingId === doc.id ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                          disabled={deletingId === doc.id}
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-10">No documents found.</div>
          )}

          {message && (
            <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
              {message}
            </div>
          )}
          {error && (
            <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow z-50">
              {error}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
              <form
                onSubmit={handleAddDocument}
                className="bg-white rounded-lg p-6 space-y-4 w-96"
              >
                <h4 className="text-lg font-semibold mb-2">Add Document</h4>
                <input
                  type="text"
                  placeholder="Document Name"
                  className="w-full border rounded px-3 py-2"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                </select>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-red-400"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-3 py-1 text-black rounded ${!formData.file || uploading ? "bg-gray-300 cursor-not-allowed" : "bg-[#addaea] hover:bg-[#92cee3]"}`}
                    disabled={!formData.file || uploading}
                  >
                    {uploading ? <FiLoader className="text-gray-600 animate-spin" size={18} /> : "Save"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {loading && <Loader />}
    </>
  );
}