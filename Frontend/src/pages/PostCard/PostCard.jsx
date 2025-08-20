// components/PostCard.jsx
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";
import API from "../../api/axios";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [likedByMe, setLikedByMe] = useState(post.likedByMe || false);

  // Handle Like/Unlike
  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
      // Check if current user has liked the post
      setLikedByMe(res.data.likes.includes(post.userId?._id));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Handle Sharing the post
  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Check out this post by ${post.userId?.name}`,
          text: post.content,
          url: postUrl,
        })
        .then(() => console.log("Post shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(postUrl)
        .then(() => alert("Post link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
    }
  };

  return (
    <div className="bg-olive-50 rounded-2xl shadow-md border border-olive-100 p-5 flex flex-col justify-between hover:shadow-lg transition">
      {/* User Info + Timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.userId?.profilePic || "https://picsum.photos/35"}
            alt="user"
            className="w-10 h-10 rounded-full object-cover border border-olive-200"
          />
          <div>
            <span className="font-semibold text-olive-900">
              {post.userId?.name}
            </span>
            <p className="text-xs text-olive-600">
              {new Date(post.createdAt).toLocaleString() || "Just now"}
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="flex-1">
        <p className="text-olive-800 leading-relaxed">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="w-full mt-3 rounded-xl object-cover h-60 shadow-sm"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-5 border-t border-olive-200 pt-3 text-olive-700">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition hover:text-olive-600`}
        >
          <Heart
            className={`w-5 h-5 ${
              likedByMe ? "fill-olive-600 text-olive-600" : ""
            }`}
          />
          <span className="text-sm">{likes.length}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 transition hover:text-olive-600"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
}
