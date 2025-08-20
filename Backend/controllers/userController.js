const User = require("../models/User");

const cloudinary = require("../config/cloudinary");
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.editUserProfile = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // ✅ Parse JSON fields (if sent as strings from frontend form-data)
    if (updateData.skills) updateData.skills = JSON.parse(updateData.skills);
    if (updateData.experience) updateData.experience = JSON.parse(updateData.experience);
    if (updateData.education) updateData.education = JSON.parse(updateData.education);
    if (updateData.socialLinks) updateData.socialLinks = JSON.parse(updateData.socialLinks);

    // ✅ Upload Profile Pic (if new one uploaded)
    if (req.files?.profilePic) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.files.profilePic[0].buffer);
      });
      updateData.profilePic = result.secure_url;
    }

    // ✅ Upload Banner Pic (if new one uploaded)
    if (req.files?.bannerPic) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "banner_pics" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.files.bannerPic[0].buffer);
      });
      updateData.bannerPic = result.secure_url;
    }

    // ✅ Update User in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,       // logged in user (secure)
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getConnectionAccepted = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("connections", "name email profilePic");

    res.json(user.connections);  // accepted connections list bhej dega
  } catch (error) {
    console.error("Error fetching accepted connections:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // ✅ Parse JSON arrays
    if (updateData.experience) updateData.experience = JSON.parse(updateData.experience);
    if (updateData.education) updateData.education = JSON.parse(updateData.education);

    // ✅ Profile Pic upload
    if (req.files?.profilePic) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.files.profilePic[0].buffer);
      });
      updateData.profilePic = result.secure_url;
    }

    // ✅ Banner Pic upload
    if (req.files?.bannerPic) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "banner_pics" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.files.bannerPic[0].buffer);
      });
      updateData.bannerPic = result.secure_url;
    }

    // ✅ Update in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendConnectionRequest = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        await User.findByIdAndUpdate(targetUserId, {
            $addToSet: { connectionRequests: req.user.id }
        });
        res.json({ msg: "Connection request sent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.acceptConnectionRequest = async (req, res) => {
    try {
        const { requestUserId } = req.body;
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { connections: requestUserId },
            $pull: { connectionRequests: requestUserId }
        });
        await User.findByIdAndUpdate(requestUserId, {
            $addToSet: { connections: req.user.id }
        });
        res.json({ msg: "Connection request accepted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // password exclude
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("connectionRequests", "name profilePic"); // populate name + profilePic

    res.json(user.connectionRequests); // array bhej do
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};