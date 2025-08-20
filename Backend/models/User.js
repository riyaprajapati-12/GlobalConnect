const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
    company: String,
    role: String,
    from: Date,
    to: Date
}, { _id: false });

const educationSchema = new mongoose.Schema({
    school: String,
    degree: String,
    from: Date,
    to: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    bannerPic: { type: String, default: "" },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [String],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    role: { type: String, enum: ["user", "admin"], default: "user" } // Added for admin support
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
