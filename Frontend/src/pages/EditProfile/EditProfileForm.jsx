import { useState, useEffect } from "react";
import API from "../../api/axios"; // ✅ your axios instance

export default function EditProfileForm({ user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skills: user?.skills || [],
    experience: user?.experience || [],
    education: user?.education || [],
    socialLinks: user?.socialLinks || {},
  });

  const [profilePic, setProfilePic] = useState(null);
  const [bannerPic, setBannerPic] = useState(null);

  // ✅ Handle text/field changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Handle file change
  const handleFileChange = (e) => {
    if (e.target.name === "profilePic") setProfilePic(e.target.files[0]);
    if (e.target.name === "bannerPic") setBannerPic(e.target.files[0]);
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("bio", formData.bio);
      data.append("skills", JSON.stringify(formData.skills));
      data.append("experience", JSON.stringify(formData.experience));
      data.append("education", JSON.stringify(formData.education));
      data.append("socialLinks", JSON.stringify(formData.socialLinks));

      if (profilePic) data.append("profilePic", profilePic);
      if (bannerPic) data.append("bannerPic", bannerPic);

      const res = await API.put("/users/edit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully ✅");
      if (onSuccess) onSuccess(res.data.user);
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update profile ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Edit Profile</h2>

      {/* Name */}
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Bio */}
      <textarea
        name="bio"
        placeholder="Write something about yourself..."
        value={formData.bio}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Profile Pic */}
      <div>
        <label className="block mb-1">Profile Picture</label>
        <input type="file" name="profilePic" onChange={handleFileChange} />
      </div>

      {/* Banner Pic */}
      <div>
        <label className="block mb-1">Banner Picture</label>
        <input type="file" name="bannerPic" onChange={handleFileChange} />
      </div>

      {/* Skills (simple comma separated for now) */}
      <input
        type="text"
        placeholder="Skills (comma separated)"
        value={formData.skills.join(", ")}
        onChange={(e) =>
          setFormData({ ...formData, skills: e.target.value.split(",") })
        }
        className="w-full border p-2 rounded"
      />

      {/* Example extra field: LinkedIn */}
      <input
        type="text"
        placeholder="LinkedIn URL"
        value={formData.socialLinks?.linkedin || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
          })
        }
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
}
