// components/TopBar.jsx
import { MessageCircle, LogOut, Bell, Briefcase, Globe2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-[#DDE5D0] via-[#F6F8F2] to-white shadow px-8 py-4 border-b border-[#C3CFB4]">
      {/* Brand Logo / Title */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        {/* Logo Circle */}
        <div className="w-10 h-10 rounded-full bg-[#6B8E23] flex items-center justify-center shadow-md">
          <Globe2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#4B5320] tracking-wide">
          Global Connect
        </h1>
      </div>

      {/* Icons + Logout + Profile */}
      <div className="flex items-center space-x-5">
        {/* Chat */}
        <div
          className="cursor-pointer hover:bg-[#EDF1E1] p-2 rounded-lg transition"
          onClick={() => navigate("/chat")}
        >
          <MessageCircle className="w-6 h-6 text-[#4B5320]" />
        </div>

        {/* Notifications */}
        <div
          className="cursor-pointer hover:bg-[#EDF1E1] p-2 rounded-lg transition"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-6 h-6 text-yellow-600" />
        </div>

        {/* Jobs */}
        <div
          className="cursor-pointer hover:bg-[#EDF1E1] p-2 rounded-lg transition"
          onClick={() => navigate("/jobs")}
        >
          <Briefcase className="w-6 h-6 text-[#2F3E1E]" />
        </div>

        {/* Logout */}
        

        {/* Profile Section */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-[#EDF1E1] px-3 py-2 rounded-xl transition"
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <img
            src={user.profilePic || "https://picsum.photos/40"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#A3B18A]"
          />
          <span className="font-medium text-[#3A4D1E]">{user.name}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition"
        >
          <LogOut className="w-5 h-5" />
          
        </button>
      </div>
    </div>
  );
}
