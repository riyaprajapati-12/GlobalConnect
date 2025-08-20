// UserCard.jsx

import { TrashIcon } from "@heroicons/react/24/solid"; 
import { Link } from "react-router-dom";

export default function UserCard({ user, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-xl transition-shadow border border-olive-200">
      
      {/* Left: Image + Info */}
      <div className="flex items-center gap-4">
        <Link to={`/user/${user._id}`}>
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-olive-300 cursor-pointer"
          />
        </Link>

        <div>
          <h2 className="text-lg font-semibold text-olive-800">{user.name}</h2>
          <p className="text-olive-600">{user.email}</p>
          <p className="text-sm text-olive-500">{user.role}</p>
        </div>
      </div>

      {/* Right: Delete Button */}
      <button
        onClick={() => onDelete(user._id)}
        className="text-olive-600 hover:text-olive-800 transition-colors"
        title="Delete User"
      >
        <TrashIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
