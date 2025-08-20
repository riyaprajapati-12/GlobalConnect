import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function EditProfile({ user, closeModal }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: [],
    profilePic: null,
    bannerPic: null,
  });

  // Preview images
  const [preview, setPreview] = useState({
    profilePic: "",
    bannerPic: "",
  });

  // Pre-fill form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills || [],
        profilePic: null,
        bannerPic: null,
      });
      setPreview({
        profilePic: user.profilePic || "",
        bannerPic: user.bannerPic || "",
      });
    }
  }, [user]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File input change handler
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
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

      const data = new FormData();
      data.append("name", formData.name);
      data.append("bio", formData.bio);
      data.append("skills", JSON.stringify(formData.skills));
      if (formData.profilePic) data.append("profilePic", formData.profilePic);
      if (formData.bannerPic) data.append("bannerPic", formData.bannerPic);

      await API.put(`/users/edit/${user._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully ✅");
      closeModal();
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
          <label className="block font-medium text-olive-800">Profile Picture</label>
          {preview.profilePic && (
            <img
              src={preview.profilePic}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full mb-2 object-cover"
            />
          )}
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Banner Pic */}
        <div>
          <label className="block font-medium text-olive-800">Banner Picture</label>
          {preview.bannerPic && (
            <img
              src={preview.bannerPic}
              alt="Banner Preview"
              className="w-full h-24 rounded-lg mb-2 object-cover"
            />
          )}
          <input
            type="file"
            name="bannerPic"
            accept="image/*"
            onChange={handleFileChange}
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
