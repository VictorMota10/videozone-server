import express from "express";
import socket from "socket.io";
import { Server } from "socket.io";
import { config } from "dotenv";
import { router } from "./router";
import { instrument } from "@socket.io/admin-ui";
import http from "http";
import cors from "cors";
import { socketEvents } from "./utils/events.map";

const app = express();
const httpServer = http.createServer(app);
config();

app.use(express.json());
app.use(cors());
app.use(router);

const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:3000"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

const clients: Array<socket.Socket> = [];

io.on("connection", (client: any) => {
  clients.push(client);

  client.on(socketEvents.askVideoTime, (data: any) => {
    io.to(data?.to).emit(socketEvents.whatTimeVideo, {
      sender: data?.sender,
    });
  });

  client.on(socketEvents.responseTimeVideo, (data: any) => {
    io.to(data.to).emit(socketEvents.currentTimeOfVideo, {
      current_time: data.current_time,
    });
  });

  client.on("disconnect", () => {
    console.log("disconnect: ", client.id);
    delete clients[client.id];
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`[RUNNING] : ${PORT}`);
});

export { io };
