import type { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./env.js";

export type RealtimeHub = {
  io: SocketIOServer;
  broadcastAvailability: (payload: unknown) => void;
};

export function createRealtime(server: HttpServer): RealtimeHub {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.WEB_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.emit("hello", { ok: true });
  });

  return {
    io,
    broadcastAvailability(payload) {
      io.emit("availability:update", payload);
    }
  };
}

