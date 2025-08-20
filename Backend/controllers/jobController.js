const Job = require("../models/Job");

exports.createJob = async (req, res) => {
    try {
        const job = new Job({
            postedBy: req.user.id,
            title: req.body.title,
            description: req.body.description,
            skills: req.body.skills,
            location: req.body.location
        });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserJobs = async (req, res) => {
  try {
    const { id } = req.params; // user id
    const jobs = await Job.find({ postedBy: id })
      .populate("postedBy", "name profilePic") // optional: to show poster info
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Error fetching user jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllJobs = async (req, res) => {
    try {
        // ✅ exclude current user's jobs
        const jobs = await Job.find({ postedBy: { $ne: req.user.id } })
            .populate("postedBy", "name profilePic");

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.applyJob = async (req, res) => {
    try {
        await Job.findByIdAndUpdate(req.params.jobId, {
            $addToSet: { applicants: req.user.id }
        });
        res.json({ msg: "Applied to job" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.delJobs = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id; // from authMiddleware

    console.log("Deleting jobId:", jobId, "by userId:", userId);

    const job = await Job.findById(jobId);
    if (!job) {
      console.log("Job not found");
      return res.status(404).json({ message: "Job not found" });
    }

    console.log("Job found:", job);

    if (!job.postedBy) {
      console.log("Job has no postedBy field");
      return res.status(400).json({ message: "Job has no postedBy field" });
    }

    if (job.postedBy.toString() !== userId) {
      console.log("User not authorized to delete this job");
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
