import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function EditProfileForm({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    profilePic: null,
    bannerPic: null,
  });

  // Load existing user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        profilePic: null,
        bannerPic: null,
      });
    }
  }, [user]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  // Convert comma-separated skills string to array
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => ({ ...prev, skills }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("bio", formData.bio);
    data.append("skills", JSON.stringify(formData.skills));
    data.append("experience", JSON.stringify(formData.experience));
    data.append("education", JSON.stringify(formData.education));
    if (formData.profilePic) data.append("profilePic", formData.profilePic);
    if (formData.bannerPic) data.append("bannerPic", formData.bannerPic);

    try {
      const res = await API.put(`/user/edit/${user._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpdate(res.data); // update parent
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow">
      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Skills (comma separated)</label>
        <input
          type="text"
          value={formData.skills.join(", ")}
          onChange={handleSkillsChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Profile Picture</label>
        <input type="file" name="profilePic" onChange={handleFileChange} />
      </div>

      <div>
        <label className="block font-medium">Banner Picture</label>
        <input type="file" name="bannerPic" onChange={handleFileChange} />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </form>
  );
}
