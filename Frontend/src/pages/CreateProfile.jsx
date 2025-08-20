import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    bio: "",
    profilePic: null,
    bannerPic: null,
    experience: [{ company: "", role: "", from: "", to: "" }],
    education: [{ school: "", degree: "", from: "", to: "" }],
    skills: ""
  });

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleArrayChange = (index, field, value, type) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("bio", formData.bio);
      data.append("skills", formData.skills);

      if (formData.profilePic) data.append("profilePic", formData.profilePic);
      if (formData.bannerPic) data.append("bannerPic", formData.bannerPic);

      data.append("experience", JSON.stringify(formData.experience));
      data.append("education", JSON.stringify(formData.education));

      const res = await API.put(`/users/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      alert("Profile Updated ✅");
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olive-50 via-white to-olive-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6 border border-olive-200"
      >
        <h2 className="text-3xl font-bold text-center text-olive-800">
          Create Your Profile
        </h2>

        {/* Bio */}
        <div>
          <label className="block mb-1 font-medium text-olive-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border border-olive-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block mb-1 font-medium text-olive-700">Profile Picture</label>
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Banner Picture */}
        <div>
          <label className="block mb-1 font-medium text-olive-700">Banner Picture</label>
          <input
            type="file"
            name="bannerPic"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-2 font-medium text-olive-700">Experience</label>
          {formData.experience.map((exp, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) =>
                  handleArrayChange(i, "company", e.target.value, "experience")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) =>
                  handleArrayChange(i, "role", e.target.value, "experience")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <input
                type="date"
                value={exp.from}
                onChange={(e) =>
                  handleArrayChange(i, "from", e.target.value, "experience")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <input
                type="date"
                value={exp.to}
                onChange={(e) =>
                  handleArrayChange(i, "to", e.target.value, "experience")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <label className="block mb-2 font-medium text-olive-700">Education</label>
          {formData.education.map((edu, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="School"
                value={edu.school}
                onChange={(e) =>
                  handleArrayChange(i, "school", e.target.value, "education")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  handleArrayChange(i, "degree", e.target.value, "education")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <input
                type="date"
                value={edu.from}
                onChange={(e) =>
                  handleArrayChange(i, "from", e.target.value, "education")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <input
                type="date"
                value={edu.to}
                onChange={(e) =>
                  handleArrayChange(i, "to", e.target.value, "education")
                }
                className="border border-olive-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <label className="block mb-1 font-medium text-olive-700">Skills</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
            className="w-full border border-olive-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-olive-600 text-white py-2 rounded-lg font-semibold hover:bg-olive-700 transition shadow-md"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
