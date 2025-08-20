import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };
    fetchPosts();
  }, [id]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/jobs/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching user jobs:", err);
      }
    };
    fetchJobs();
  }, [id]);

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  if (loading) return <p className="p-6 text-olive-700">Loading...</p>;
  if (!user) return <p className="p-6 text-olive-700">User not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 via-white to-olive-100 p-6">
      {/* Home Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/admin")}
          className="bg-olive-600 text-white px-4 py-2 rounded hover:bg-olive-700 transition"
        >
          Home
        </button>
      </div>

      {/* Banner */}
      <div className="relative h-48 bg-olive-200 rounded-lg">
        {user.bannerPic && (
          <img
            src={user.bannerPic}
            alt="banner"
            className="w-full h-full object-cover rounded-lg"
          />
        )}
        {user.profilePic && (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white absolute bottom-0 left-6 transform translate-y-1/2"
          />
        )}
      </div>

      {/* Basic Info */}
      <div className="mt-16 ml-6">
        <h2 className="text-2xl font-bold text-olive-800">{user.name}</h2>
        <p className="text-olive-700">{user.bio}</p>
        <div className="mt-2 flex gap-2 flex-wrap">
          {user.skills?.map((skill, idx) => (
            <span
              key={idx}
              className="bg-olive-200 text-olive-800 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience & Education */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-olive-800">Experience</h3>
          {user.experience?.length > 0 ? (
            user.experience.map((exp, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow mb-2 border border-olive-200">
                <h4 className="font-semibold text-olive-700">{exp.role}</h4>
                <p className="text-olive-600">{exp.company}</p>
                <p className="text-sm text-olive-500">
                  {new Date(exp.from).toLocaleDateString()} -{" "}
                  {exp.to ? new Date(exp.to).toLocaleDateString() : "Present"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-olive-600">No experience listed.</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-olive-800">Education</h3>
          {user.education?.length > 0 ? (
            user.education.map((edu, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow mb-2 border border-olive-200">
                <h4 className="font-semibold text-olive-700">{edu.degree}</h4>
                <p className="text-olive-600">{edu.school}</p>
                <p className="text-sm text-olive-500">
                  {new Date(edu.from).toLocaleDateString()} -{" "}
                  {edu.to ? new Date(edu.to).toLocaleDateString() : "Present"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-olive-600">No education listed.</p>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-olive-800">Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center border border-olive-200"
            >
              <div>
                <p className="text-olive-700">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="mt-2 max-h-60 rounded"
                  />
                )}
              </div>
              <button
                onClick={() => handleDeletePost(post._id)}
                className="text-olive-600 hover:text-olive-800 transition"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-olive-600">No posts yet.</p>
        )}
      </div>

      {/* Jobs */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-olive-800">Jobs Posted</h3>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center border border-olive-200"
            >
              <div>
                <h4 className="font-bold text-olive-700 text-lg">{job.title}</h4>
                <p className="text-olive-600">{job.description}</p>
                {job.skills?.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-olive-200 text-olive-800 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-sm text-olive-500">
                  Location: {job.location || "Not specified"}
                </p>
              </div>
              <button
                onClick={() => handleDeleteJob(job._id)}
                className="text-olive-600 hover:text-olive-800 transition"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-olive-600">No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}
