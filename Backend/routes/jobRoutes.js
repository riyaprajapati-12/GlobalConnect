const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    createJob,
    getAllJobs,
    applyJob,
    getUserJobs,
    delJobs
} = require("../controllers/jobController");

const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getAllJobs);
router.post("/apply/:jobId", authMiddleware, applyJob);
router.get("/user/:id", authMiddleware, getUserJobs);
router.delete("/:id", authMiddleware, delJobs);

module.exports = router;