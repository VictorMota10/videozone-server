import express from "express";
import socket from "socket.io";
import { Server } from 'socket.io'
import http from "http";
import cors from 'cors'

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors())
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  path: "/socket.io",
  cors: {
    origin: "*",
  },
});

const clients: Array<socket.Socket> = [];

io.on("connection", (client: socket.Socket) => {
  console.log("Client connected: ", client.id);
  clients.push(client);

  client.on("disconnect", () => {
    console.log("Client disconnected: ", client.id);
    clients.splice(clients.indexOf(client), 1);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
