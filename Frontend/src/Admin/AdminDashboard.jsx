// AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "./adminPages/UserCard";
import API from "../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentUserId = localStorage.getItem("userId");

        const res = await API.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredUsers = res.data.filter(
          (user) => user._id !== currentUserId
        );
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 via-white to-olive-100">
      {/* Navbar */}
      <nav className="bg-olive-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="text-xl font-bold">Global Connect</div>
        <button
          onClick={handleLogout}
          className="bg-olive-400 hover:bg-olive-500 px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </nav>

      {/* Main Dashboard Content */}
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4 text-olive-800">Admin Dashboard</h1>
        <p className="text-olive-700">Welcome to the Global Connect Admin Panel.</p>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} onDelete={handleDelete} />
          ))}
        </div>
      </main>
    </div>
  );
}
