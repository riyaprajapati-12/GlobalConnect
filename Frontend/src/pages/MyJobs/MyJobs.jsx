import { useEffect, useState } from "react";
import API from "../../api/axios";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null); // to track which job's menu is open

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const res = await API.get(`/jobs/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Failed to delete job");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-olive-700">Loading your jobs...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-6">
      <h2 className="text-2xl font-bold text-olive-900 mb-4">My Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-olive-600">You haven't posted any jobs yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            className="bg-olive-50 border border-olive-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 relative"
          >
            {/* Top row with title and three dots */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-olive-800">{job.title}</h3>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === job._id ? null : job._id)
                  }
                  className="p-1 rounded-full hover:bg-olive-200 transition"
                >
                  <EllipsisVerticalIcon className="w-5 h-5 text-olive-600" />
                </button>

                {openMenuId === job._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-olive-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="text-olive-700">{job.description}</p>
            {job.skills?.length > 0 && (
              <p className="text-sm text-olive-600">Skills: {job.skills.join(", ")}</p>
            )}
            {job.location && (
              <p className="text-sm text-olive-600">Location: {job.location}</p>
            )}
            <p className="text-xs text-olive-500">
              Posted: {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
