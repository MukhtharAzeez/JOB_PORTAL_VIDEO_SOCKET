const io = require("socket.io")(8000, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let activeUser = [];

io.on("connection", (socket) => {
    socket.on("new-user-add", (newUserId) => {
        if (!activeUser.some((user) => user.userId === newUserId)) {
            activeUser.push({
                userId: newUserId,
                socketId: socket.id,
            });
        }
        io.emit("get-user", activeUser);
    });
    io.emit("get-user", activeUser);
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUser.find((user) => user.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit("receive-message", data);
        }
    });
    socket.on("send-notification", (data) => {
        const { receiver } = data;
        const user = activeUser.find((user) => {
            return user.userId === receiver;
        });
        if (user) {
            io.to(user.socketId).emit("receive-notification", data);
        }
    });

    socket.on("disconnect", () => {
        activeUser = activeUser.filter((user) => user.socketId !== socket.id);
        io.emit("get-users", activeUser);
    });
});
