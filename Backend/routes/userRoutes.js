const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
    getUserProfile,
    updateUserProfile,
    sendConnectionRequest,
    acceptConnectionRequest,
    getAllUsers,
    getAllConnections,
    getConnectionAccepted
    
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

router.get("/connections/accepted", authMiddleware, getConnectionAccepted);

router.get("/:id/connections",authMiddleware, async (req, res) => {
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

router.put("/edit/:id",authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body }, // req.body may include bio, profilePic, experience, etc.
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = router;
