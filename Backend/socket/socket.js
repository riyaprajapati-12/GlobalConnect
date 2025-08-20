const { Server } = require("socket.io");

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "https://global-connect-ten.vercel.app", // frontend
            methods: ["GET", "POST"]
        }
    });

    let activeUsers = new Map();

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("join", (userId) => {
            socket.join(userId);
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} joined and is active`);
            io.emit("active_users", Array.from(activeUsers.keys()));
        });

        socket.on("disconnect", () => {
            for (let [userId, sockId] of activeUsers.entries()) {
                if (sockId === socket.id) {
                    activeUsers.delete(userId);
                    break;
                }
            }
            console.log(`User disconnected: ${socket.id}`);
            io.emit("active_users", Array.from(activeUsers.keys()));
        });
    });

    return io; // ✅ important
}

module.exports = setupSocket;
