import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Home } from "lucide-react"; 
export default function UserPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const loggedInUserId = localStorage.getItem("userId");

        const userRes = await API.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(userRes.data);

        if (userRes.data.connections?.includes(loggedInUserId)) {
          setConnected(true);
        } else if (userRes.data.connectionRequests?.includes(loggedInUserId)) {
          setRequestSent(true);
        }

        const postRes = await API.get(`/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postRes.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await API.post(
        "/users/connections/send",
        { targetUserId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestSent(true);
      alert("✅ Connection request sent!");
    } catch (err) {
      console.error("Failed to send request:", err);
      alert("❌ Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <p className="text-center mt-10 text-olive-800 font-medium">Loading...</p>
    );

  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6">
      {/* Banner + ProfilePic */}
      <div className="relative">
        <img
          src={profile.bannerPic || "https://picsum.photos/800/200"}
          alt="banner"
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
    onClick={() => navigate("/dashboard")}
    className="absolute top-3 left-3 p-2 bg-white/80 text-olive-800 rounded-full shadow hover:bg-white transition"
  >
    <Home className="w-5 h-5" />
  </button>

        <img
          src={profile.profilePic || "https://picsum.photos/100"}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white absolute -bottom-12 left-6"
        />
      </div>

      {/* Info */}
      <div className="mt-64 px-2">
        <h2 className="text-2xl font-bold text-olive-900 mt-10">{profile.name}</h2>
        <p className="text-olive-700">{profile.bio || "No bio available"}</p>
        {profile.skills?.length > 0 && (
          <p className="mt-2 text-sm text-olive-600">
            Skills: {profile.skills.join(", ")}
          </p>
        )}

        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSendRequest}
            disabled={loading || requestSent || connected}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              connected
                ? "bg-olive-700 cursor-not-allowed"
                : requestSent
                ? "bg-olive-500 cursor-not-allowed"
                : "bg-olive-600 hover:bg-olive-700"
            }`}
          >
            {connected
              ? "Connected "
              : requestSent
              ? "Request Sent"
              : loading
              ? "Sending..."
              : "Send Request"}
          </button>

         
        </div>
      </div>

      {/* Posts */}
      <div className="bg-olive-50 shadow rounded-lg p-4">
        <h3 className="font-semibold text-olive-800 mb-4">Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="border-b border-olive-200 py-3 last:border-b-0"
            >
              <p className="text-olive-700">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="mt-2 rounded-lg max-h-60 object-cover w-full"
                />
              )}
              <p className="text-sm text-olive-500 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-olive-500">No posts yet</p>
        )}
      </div>
    </div>
  );
}
