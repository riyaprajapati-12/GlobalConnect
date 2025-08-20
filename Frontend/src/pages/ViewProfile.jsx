import { useEffect, useState } from "react";
import { Home, Edit } from "lucide-react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import JobPostForm from "./create_job_post_form";
import { motion, AnimatePresence } from "framer-motion";
import MyJobs from "./MyJobs/MyJobs";
import Myposts from "./Myposts/Myposts";
import EditProfileForm from "./EditProfile/EditProfileForm";

export default function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const resUser = await API.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        // Fetch user's posts
        const resPosts = await API.get(`/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(resPosts.data);
      } catch (err) {
        setError("Failed to fetch profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, showEditForm]); // refresh after edit

  if (loading)
    return (
      <p className="text-center mt-10 text-olive-800 font-semibold">
        Loading profile...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-medium">{error}</p>
    );

  return (
    <div className="min-h-screen bg-olive-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Left Main Content */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-olive-100 rounded-2xl shadow-xl overflow-hidden relative">
            {/* Banner */}
            {user.bannerPic ? (
              <div className="h-48 w-full relative overflow-hidden">
                <img
                  src={user.bannerPic}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => navigate("/dashboard")}
                  className="absolute top-4 left-4 p-2 bg-white/80 text-olive-800 rounded-full hover:bg-white transition"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-olive-600 to-olive-400 h-40 w-full relative">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="absolute top-4 left-4 p-2 bg-white/80 text-olive-800 rounded-full hover:bg-white transition"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Edit Profile Button */}
            <button
              onClick={() => setShowEditForm(true)}
              className="absolute top-4 right-4 p-2 bg-white/80 text-olive-800 rounded-full hover:bg-white transition flex items-center space-x-1"
            >
              <Edit className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Edit</span>
            </button>

            {/* Profile Info */}
            <div className="relative px-6">
              <div className="absolute -top-14 left-6">
                <img
                  src={user.profilePic || "https://via.placeholder.com/120"}
                  alt={user.name}
                  className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover z-10"
                />
              </div>

              <div className="pt-20 pl-2 mb-6 flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-olive-900">{user.name}</h2>
                <span className="bg-olive-200 text-olive-900 px-2 py-1 rounded-full text-sm font-medium">
                  {user.connections?.length || 0} connections
                </span>
              </div>
              <p className="text-olive-700">{user.email}</p>
              <p className="mt-2 text-sm text-olive-800">{user.bio}</p>

              {/* Skills */}
              {user.skills?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-olive-800">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-olive-200 text-olive-900 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {user.experience?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-olive-800">Experience</h3>
                  <div className="space-y-3">
                    {user.experience.map((exp, i) => (
                      <div
                        key={i}
                        className="bg-olive-50 rounded-lg p-3 border border-olive-200"
                      >
                        <p className="font-medium text-olive-900">{exp.company}</p>
                        <p className="text-sm text-olive-700">{exp.role}</p>
                        <p className="text-xs text-olive-600">
                          {new Date(exp.from).toLocaleDateString()} -{" "}
                          {exp.to ? new Date(exp.to).toLocaleDateString() : "Present"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {user.education?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-olive-800">Education</h3>
                  <div className="space-y-3">
                    {user.education.map((edu, i) => (
                      <div
                        key={i}
                        className="bg-olive-50 rounded-lg p-3 border border-olive-200"
                      >
                        <p className="font-medium text-olive-900">{edu.school}</p>
                        <p className="text-sm text-olive-700">{edu.degree}</p>
                        <p className="text-xs text-olive-600">
                          {new Date(edu.from).toLocaleDateString()} -{" "}
                          {edu.to ? new Date(edu.to).toLocaleDateString() : "Present"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User's Posts */}
              <div className="mt-6 mb-4 bg-olive-50 shadow rounded-lg p-4">
                <h3 className="font-semibold text-olive-800 mb-4">Posts</h3>
                {posts.length > 0 ? (
                  posts.map((post) => <Myposts key={post._id} post={post} />)
                ) : (
                  <p className="text-olive-500">No posts yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: MyJobs */}
        <div className="col-span-12 lg:col-span-3">
          <MyJobs />
        </div>
      </div>

      {/* Floating Job Post Button */}
      <button
        onClick={() => setShowJobForm(true)}
        className="fixed bottom-6 right-6 bg-olive-700 text-white rounded-full shadow-xl w-14 h-14 flex items-center justify-center hover:bg-olive-800 transition-all duration-200"
      >
        +
      </button>

      {/* Job Post Modal */}
      <AnimatePresence>
        {showJobForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setShowJobForm(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
              <JobPostForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setShowEditForm(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
              <EditProfileForm
                user={user}
                onSuccess={(updatedUser) => {
                  setUser(updatedUser);
                  setShowEditForm(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
