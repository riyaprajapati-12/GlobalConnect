

import { useState } from "react";
import API from "../../api/axios";

export default function Myposts({ post }) {
  const [showMenu, setShowMenu] = useState(false);

  const currentUserId = localStorage.getItem("userId"); // get userId from localStorage

  const handleDelete = async () => {
    if (currentUserId !== post.userId) {
      alert("You can only delete your own posts.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
       const res = await API.delete(`/posts/${post._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data)
        // notify parent to remove post from state
      } catch (err) {
        console.error("Failed to delete post:", err);
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <div className="border-b border-olive-200 py-3 last:border-b-0 relative">
      {/* Three-dot menu */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-olive-500 hover:text-olive-700"
        >
          ⋮
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-1 w-24 bg-white border border-olive-200 rounded-lg shadow-md z-10">
            <button
              onClick={handleDelete}
              className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Post content */}
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
  );
}

