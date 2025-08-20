const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
exports.createPost = async (req, res) => {
    try {
        let imageUrl = "";

        // Agar image file bheji gayi hai
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "post_images" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }

        const post = new Post({
            userId: req.user._id,
            content: req.body.content,
            image: imageUrl
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "name profilePic")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Toggle like: if user already liked, remove; else add
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes.pull(userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({ 
      msg: "Post liked/unliked successfully", 
      likes: post.likes 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.commentOnPost = async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: { userId: req.user.id, text: req.body.text } }
        });
        res.json({ msg: "Comment added" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id })
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// controllers/postController.js

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only the user who created the post can delete it
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
