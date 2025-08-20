const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
    getAllUsers,
    deleteUser,
    deletePost,
    deleteJob
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);
router.delete("/post/:id", authMiddleware, adminMiddleware, deletePost);
router.delete("/job/:id", authMiddleware, adminMiddleware, deleteJob);

module.exports = router;
