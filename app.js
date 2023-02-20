const io = require("socket.io")(8400, {
    cors: {
        origin: "*",
    },
});


io.on("connection", (socket) => {
    io.emit('me', socket.id);
    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        io
            .to(userToCall)
            .emit('callUser', { signal: signalData, from, name });
    });
    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

    socket.on("disconnect", () => {
        io.emit('Call ended');
    });
});