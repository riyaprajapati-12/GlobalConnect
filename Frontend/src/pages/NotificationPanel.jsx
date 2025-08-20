import { useState, useEffect } from "react";
import { Check, X, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/users/connections/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const requestsArray = Array.isArray(res.data) ? res.data : [];
        setNotifications(
          requestsArray.map((req, idx) => ({
            id: idx + 1,
            userId: req._id,
            name: req.name || "Unknown",
            profilePic: req.profilePic || "/default-avatar.png",
            text: `${req.name || "Unknown"} sent you a connection request`,
            type: "connection",
            read: false,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    };

    fetchRequests();
  }, []);

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleAccept = async (id, userId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/users/connections/accept",
        { requestUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleMarkRead(id);
      alert("Connection accepted!");
    } catch (err) {
      console.error(err);
      alert("Failed to accept connection");
    }
  };

  const handleReject = async (id, userId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/users/connections/cancel",
        { requestUserId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleMarkRead(id);
      alert("Connection rejected!");
    } catch (err) {
      console.error(err);
      alert("Failed to reject connection");
    }
  };

  return (
    <div className="w-screen h-screen bg-[#F0F4E3] flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-[#6B8E23] text-white shadow-md">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 bg-[#8FBC5B] hover:bg-[#7FA142] px-3 py-2 rounded-lg"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No notifications</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border flex justify-between items-center ${
              n.read
                ? "bg-gray-200 text-gray-500"
                : "bg-[#F5F9E1] text-[#333]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={n.profilePic}
                alt={n.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{n.text}</span>
            </div>

            {!n.read && n.type === "connection" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(n.id, n.userId)}
                  className="p-2 rounded-full bg-[#D4E157] hover:bg-[#C0D22E]"
                >
                  <Check className="w-4 h-4 text-[#6B8E23]" />
                </button>
                <button
                  onClick={() => handleReject(n.id, n.userId)}
                  className="p-2 rounded-full bg-[#F08080] hover:bg-[#E06666]"
                >
                  <X className="w-4 h-4 text-[#8B0000]" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
