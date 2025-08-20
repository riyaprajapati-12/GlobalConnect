const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const setupSocket = require("./socket/socket");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO and get io instance
const io = setupSocket(server);

// ✅ Attach io to every request (important for controllers)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => res.send("Global Connect API Running"));

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
