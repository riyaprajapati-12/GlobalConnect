import { useState } from "react";
import API from "../api/axios";

export default function CreatePost({ onClose }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && !image) {
      alert("Please write something or upload an image!");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await API.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setContent("");
      setImage(null);
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create post");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-olive-50 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-olive-900 mb-4">Create Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border border-olive-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-olive-400 focus:border-olive-400"
          rows={3}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border border-olive-300 rounded-lg p-2 focus:ring-2 focus:ring-olive-400 focus:border-olive-400"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-olive-600 text-white py-2 rounded-lg font-semibold hover:bg-olive-700 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
}
