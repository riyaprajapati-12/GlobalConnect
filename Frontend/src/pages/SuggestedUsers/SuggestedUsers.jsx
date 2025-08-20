// components/SuggestedUsers.jsx
import { useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";

export default function SuggestedUsers({ suggested, sendConnectionRequest }) {
  const navigate = useNavigate();
  const filteredSuggested = suggested.filter((sug) => sug.role !== "admin");

  return (
    <div className="bg-olive-50 rounded-2xl shadow-md border border-olive-200 p-5">
      <h2 className="font-semibold text-lg mb-4 text-olive-700"> Suggested</h2>
      {filteredSuggested.length > 0 ? (
        filteredSuggested.map((sug) => (
          <div
            key={sug._id}
            className="flex items-center justify-between mb-3 p-2 rounded-lg hover:bg-olive-100 transition cursor-pointer"
          >
            {/* User Info */}
            <div
              className="flex items-center space-x-3"
              onClick={() => navigate(`/userpage/${sug._id}`)}
            >
              <img
                src={sug.profilePic || "https://picsum.photos/35"}
                alt={sug.name}
                className="w-10 h-10 rounded-full object-cover border border-olive-300 shadow-sm"
              />
              <span className="text-olive-900 font-medium">{sug.name}</span>
            </div>

            {/* Add Connection Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sendConnectionRequest(sug._id);
              }}
              className="p-2 rounded-full bg-olive-100 hover:bg-olive-200 transition"
            >
              <UserCheck className="w-5 h-5 text-olive-700" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-olive-600 text-sm italic">No suggestions </p>
      )}
    </div>
  );
}
