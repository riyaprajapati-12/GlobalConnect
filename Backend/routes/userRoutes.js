const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    getUserProfile,
    updateUserProfile,
    sendConnectionRequest,
    acceptConnectionRequest,
    getAllUsers,
    getAllConnections
} = require("../controllers/userController");
const User = require("../models/User");
const router = express.Router();

router.get("/:id", authMiddleware, getUserProfile);
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "bannerPic", maxCount: 1 }
  ]),
  updateUserProfile
);
// Get all users
router.get("/",authMiddleware,getAllUsers);

router.post("/connections/send", authMiddleware, sendConnectionRequest);
router.post("/connections/accept", authMiddleware, acceptConnectionRequest);


router.get("/connections/requests", authMiddleware, getAllConnections);

router.get("/connections/accepted", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("connections", "name email profilePic");

    res.json(user.connections);  // accepted connections list bhej dega
  } catch (error) {
    console.error("Error fetching accepted connections:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/connections", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("connections", "name profilePic"); // sirf name & pic bhejna
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.connections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
});



module.exports = router;
