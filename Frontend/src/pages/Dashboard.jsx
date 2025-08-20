
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import API from "../api/axios";
import TopBar from "./TopBar/TopBar";
import Connections from "./Connections/Connections";
import SuggestedUsers from "./SuggestedUsers/SuggestedUsers";
import PostCard from "./PostCard/PostCard";
import CreatePost from "./Createpost";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Connection request
  const sendConnectionRequest = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/users/connections/send",
        { targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggested((prev) => prev.filter((u) => u._id !== targetUserId));
    } catch (err) {
      console.error(err);
    }
  };

  // Like toggle
  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        `/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: Array(res.data.likes).fill("x"),
                likedByMe: res.data.likedByMe,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const userRes = await API.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const feedRes = await API.get(`/posts/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(feedRes.data);

      const connRes = await API.get(`/users/${userId}/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(connRes.data);

      const usersRes = await API.get(`/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const connectedIds = connRes.data.map((c) => c._id);
      const filtered = usersRes.data.filter(
        (u) => u._id !== userId && !connectedIds.includes(u._id)
      );

      setSuggested(filtered);
    };
    fetchData();
  }, []);

  if (!user)
    return <p className="text-center mt-10 text-olive-700">Loading...</p>;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-olive-50 via-white to-olive-100">
      {/* Decorative abstract background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full bg-olive-200 blur-[140px] opacity-40" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full bg-olive-300 blur-[160px] opacity-30" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-olive-200 blur-[100px] opacity-20" />
      </div>

      {/* TopBar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/60 shadow-sm border-b border-olive-100">
        <TopBar user={user} onLogout={handleLogout} />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 max-w-full mx-auto mt-6 px-2 gap-10">
        {/* Left Sidebar */}
        <div className="col-span-3 hidden lg:block">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-4 border border-olive-100 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-olive-800 mb-3">
              Your Connections
            </h2>
            <Connections connections={connections} />
          </div>
        </div>

        {/* Feed */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Create Post Input */}
          <div
            onClick={() => setShowCreatePost(true)}
            className="bg-white/70 backdrop-blur-md border border-olive-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer shadow hover:shadow-lg transition"
          >
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt="user avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="flex-1 bg-olive-50 text-olive-600 px-4 py-2 rounded-full border border-olive-200 hover:bg-olive-100 transition">
              ✨ What's on your mind, {user.name.split(" ")[0]}?
            </div>
            <Plus className="w-5 h-5 text-olive-500" />
          </div>

          {/* Posts */}
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} toggleLike={toggleLike} />
            ))
          ) : (
            <p className="text-center text-olive-700 font-medium">No posts yet</p>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 hidden lg:block">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-4 border border-olive-100 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-olive-800 mb-3">
              Suggested For You
            </h2>
            <SuggestedUsers
              suggested={suggested}
              sendConnectionRequest={sendConnectionRequest}
            />
          </div>
        </div>
      </div>

      {/* Floating Create Button (Mobile) */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed lg:hidden bottom-6 right-6 bg-olive-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-olive-700 transition z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg relative shadow-xl border border-olive-200 animate-fadeInUp">
            <button
              onClick={() => setShowCreatePost(false)}
              className="absolute top-3 right-3 text-olive-500 hover:text-olive-700"
            >
              ✕
            </button>
            <CreatePost onClose={() => setShowCreatePost(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
