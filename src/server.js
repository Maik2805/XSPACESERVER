"use strict";
/**
 * Module dependencies.
 */
const { Server } = require("socket.io");

/**
 * Load environment variables from .env file.
 */
const clientURLLocalhost = "http://localhost:3000";
const clientUrlDeploy = "https://xspace-beta.vercel.app";

const port = 8080;

/**
 * Create a WebSocket server using Socket.IO.
 * Configured with CORS policy to allow connections from specified origins.
 */
const io = new Server({
  cors: {
    origin: [clientURLLocalhost],
  },
});

io.listen(port);

io.on("connection", (socket) => {

  console.log(
    "Player joined with ID",
    socket.id,
    ". There are " + io.engine.clientsCount + " players connected."
  );


  socket.on("player-moving", (transforms) => {
    socket.broadcast.emit("player-moving", transforms);
  });

  socket.on("player-shot", (transforms) => {
    socket.broadcast.emit("player-shot", transforms);
  });
  socket.on("player-dead", (data) => {
    socket.broadcast.emit("player-dead", data);
  });
  socket.on("generate-live", (data) => {
    socket.broadcast.emit("generate-live", data);
  });

  socket.on("disconnect", () => {
    console.log(
      "Player disconnected with ID",
      socket.id,
      ". There are " + io.engine.clientsCount + " players connected"
    );
  });
});


// function createLive() {
//   const clients = Array.from(io.sockets.sockets.values());
//   if (clients.length > 0) {
//     const randomIndex = Math.floor(Math.random() * clients.length);
//     const randomSocket = clients[randomIndex];
//     randomSocket.emit("generate-live", { message: "This is a live" });
//   }
// }
// setInterval(createLive, 5000);