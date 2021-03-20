const express = require("express")
const INDEX = '/index.html';

const PORT = process.env.PORT || 5000;
const server = express()
.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
.listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = require("socket.io")(server, {
	cors: {
		origin: "https://avivid-client.herokuapp.com",
		methods: [ "GET", "POST" ],
        credentials: true
	}
})

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

// server.listen(5000, () => console.log("server is running on port 5000"))