const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "./public/");

app.use(express.static(publicDirectoryPath));

// .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
// .listen(PORT, () => console.log(`Listening on ${PORT}`));

socketio(server, {
	cors: {
		origin: "https://avivid-client.herokuapp.com",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

io.on("connection", socket => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded");
	});

	socket.on("callUser", data => {
		io.to(data.userToCall).emit("callUser", {
			signal: data.signalData,
			from: data.from,
			name: data.name,
		});
	});
	socket.on("answerCall", data => {
		io.to(data.to).emit("callAccepted", data.signal);
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("server is running on port 5000"));

// server.listen(5000, () => console.log("server is running on port 5000"))
