import express from "express";
import socket from "socket.io";
import { Server } from "socket.io";
import { config } from "dotenv";
import { router } from './router'
import http from "http";
import cors from "cors";

const app = express();
const httpServer = http.createServer(app);
config();

app.use(cors());
app.use(router)

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

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(process.env.FIREBASE_DATABASE_URL)
  console.log(`Server started at ${PORT}`);
});
