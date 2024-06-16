"use strict";
/**
 * Module dependencies.
 */
const { Server } = require("socket.io");
const readline = require("readline");

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
    origin: [clientURLLocalhost, clientUrlDeploy],
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

  socket.on("current-lives", (data) => {
    socket.broadcast.emit("current-lives", data);
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

/**
 * Set up readline interface to listen for keyboard input.
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if (input.trim() === '1') {
    // Emit the 'generate-live' event to all connected clients
    io.emit("generate-live", { id: "projectileId", position: [2, 3, -45] });
    console.log('Emitted "generate-live" event to all clients.');
  } else if (input.trim() === '2') {
    // Emit the 'generate-live' event to all connected clients
    io.emit("current-lives", { lives: 4 });
    console.log('current lives event to all clients.');
  }
});
