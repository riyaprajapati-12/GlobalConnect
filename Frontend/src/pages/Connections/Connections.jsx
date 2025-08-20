// components/Connections.jsx
import { useNavigate } from "react-router-dom";

export default function Connections({ connections }) {
  const navigate = useNavigate();
  return (
    <div className="bg-olive-50 rounded-2xl shadow-md border border-olive-200 p-5">
      <h2 className="font-semibold text-lg mb-4 text-olive-700">
         Follow List
      </h2>
      {connections.length > 0 ? (
        <ul className="space-y-3">
          {connections.map((conn) => (
            <li
              key={conn._id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-olive-100 p-2 rounded-lg transition"
              onClick={() => navigate(`/userpage/${conn._id}`)}
            >
              <img
                src={conn.profilePic || "https://picsum.photos/40"}
                alt={conn.name}
                className="w-10 h-10 rounded-full object-cover border border-olive-300 shadow-sm"
              />
              <span className="text-olive-900 font-medium">{conn.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-olive-600 text-sm italic">No connections yet </p>
      )}
    </div>
  );
}
