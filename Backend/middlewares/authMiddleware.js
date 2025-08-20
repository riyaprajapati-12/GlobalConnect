const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ msg: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = authMiddleware;
