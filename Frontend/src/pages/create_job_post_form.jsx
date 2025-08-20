import { useState } from "react";
import API from "../api/axios";

export default function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
   
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/jobs", formData);
      setMessage("✅ Job created successfully!");
      console.log(res.data);
      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Error creating job");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-olive-50 shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-olive-900">Create Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-olive-200 p-2 rounded focus:ring-2 focus:ring-olive-400 focus:border-olive-400"
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-olive-200 p-2 rounded focus:ring-2 focus:ring-olive-400 focus:border-olive-400"
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full border border-olive-200 p-2 rounded focus:ring-2 focus:ring-olive-400 focus:border-olive-400"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border border-olive-200 p-2 rounded focus:ring-2 focus:ring-olive-400 focus:border-olive-400"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-olive-600 text-white p-2 rounded hover:bg-olive-700 transition"
        >
          Create Job
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-olive-700 font-medium">{message}</p>
      )}
    </div>
  );
}
