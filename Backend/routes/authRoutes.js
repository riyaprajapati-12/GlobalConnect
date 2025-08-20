const express = require("express");
const { register, login } = require("../controllers/authController");
const User = require("../models/User")
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/login", login);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body; // frontend will send Google id_token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
  user = new User({
    email,
    name,
    profilePic: picture,
    googleId: sub,
    password: undefined,
  });
  await user.save();
}

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Google auth failed", error });
  }
});

module.exports = router;