import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // ✅ search state

  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await API.post(`/jobs/apply/${jobId}`);
      alert("Applied successfully!");

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? { ...job, applicants: [...(job.applicants || []), currentUserId] }
            : job
        )
      );
    } catch (error) {
      console.error("Error applying job:", error);
      alert("Something went wrong!");
    }
  };

  if (loading) return <p className="text-center text-olive-700">Loading jobs...</p>;

  // ✅ Filter jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    [job.title, job.description, job.location]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Top Heading and Home Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold text-olive-800">Available Jobs</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition"
        >
          Home
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search jobs by title, description, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-olive-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
        />
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-olive-700">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const alreadyApplied = job.applicants?.includes(currentUserId);

            return (
              <div
                key={job._id}
                className="border border-olive-200 rounded-xl p-4 shadow-md flex flex-col bg-white"
              >
                {/* Profile Info */}
                <div className="flex items-center mb-3">
                  <img
                    src={job.postedBy?.profilePic || "/default-avatar.png"}
                    alt={job.postedBy?.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <span className="font-semibold text-olive-800">{job.postedBy?.name}</span>
                </div>

                {/* Job Info */}
                <h2 className="text-lg font-semibold text-olive-800">{job.title}</h2>
                <p className="text-olive-700">{job.description}</p>
                <p className="text-sm text-olive-500 mt-2">
                  Location: {job.location}
                </p>
                {job.salary && (
                  <p className="text-sm text-olive-500">Salary: {job.salary}</p>
                )}

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={alreadyApplied}
                  className={`mt-3 px-4 py-2 rounded-lg font-medium text-white transition ${
                    alreadyApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-olive-600 hover:bg-olive-700"
                  }`}
                >
                  {alreadyApplied ? "Already Applied" : "Apply"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
