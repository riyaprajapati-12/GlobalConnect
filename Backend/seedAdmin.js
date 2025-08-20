const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config(); // ✅ .env load karega

mongoose.connect(process.env.DB_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const admin = new User({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    process.exit();
  })
  .catch(err => console.error(err));
