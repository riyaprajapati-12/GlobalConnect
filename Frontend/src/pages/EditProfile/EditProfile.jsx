import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function EditProfile({ user, closeModal }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: "",
    bannerPic: "",
    skills: [],
  });

  // Pre-fill form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profilePic: user.profilePic || "",
        bannerPic: user.bannerPic || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Skills input (comma separated)
  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.put(`/users/edit/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully ✅");
      closeModal(); // close modal after success
    } catch (error) {
      console.error(error);
      alert("❌ Error updating profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-olive-900">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium text-olive-800">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block font-medium text-olive-800">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Profile Pic */}
        <div>
          <label className="block font-medium text-olive-800">Profile Picture URL</label>
          <input
            type="text"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Banner Pic */}
        <div>
          <label className="block font-medium text-olive-800">Banner Picture URL</label>
          <input
            type="text"
            name="bannerPic"
            value={formData.bannerPic}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block font-medium text-olive-800">Skills (comma separated)</label>
          <input
            type="text"
            value={formData.skills.join(", ")}
            onChange={handleSkillsChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-olive-700 text-white hover:bg-olive-800"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
