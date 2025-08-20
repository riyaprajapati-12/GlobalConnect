const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { sendMessage, getChatHistory } = require("../controllers/messageController");

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getChatHistory);

module.exports = router;
