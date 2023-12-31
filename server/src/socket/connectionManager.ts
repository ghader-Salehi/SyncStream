import { io } from "./index";
import * as roomManager from "./roomManager";
import { Client } from "../models/client";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

interface IJWTUser {
  id: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export const connections: Client[] = [];

function getUser(token: string): IJWTUser | null {
  let user = null;

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
    if (error) {
      user = null;
    }

    if (decoded && decoded.exp) {
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        user = null;
      }
    }
    user = decoded;
  });

  return user;
}

export async function setup() {
  io.on("connection", (socket) => {
    const roomID: string = socket.handshake.query.id;
    const token: string = socket.handshake.auth.token;
    const user: IJWTUser = getUser(token);

    const userName = user?.name || "";
    const room = roomManager.rooms.find((r) => r._id === roomID);

    if (!roomManager.isClientExit(roomID, socket.id)) {
      socket.join(roomID);
      const client = new Client(`room:${roomID}`, uuidv4(), socket, user ? token : "");
      connections.push(client);
      roomManager.addClient(roomID, socket, {
        id: user.id,
        name: user.name,
        email: user.email,
        state: "unready",
      });
      socket.broadcast.to(roomID).emit("/join-user", `${userName} joined the room`);

      const users = room?.users
        ? room.users.map((u) => ({
            name: u.name,
            email: u.email,
            id: u.id,
            status: u.state,
            isAdmin: u.id === room.adminId,
          }))
        : [];

      socket.emit("/users", users);
      socket.broadcast.to(roomID).emit("/users", users);

      if (room?.type) socket.emit("/room", { type: room.type, adminId: room.adminId });
      if (room?.info) socket.emit("/sync", room.info);
      if (room?.videoUrl) socket.emit("/get-video", { url: room.videoUrl });
      if (room?.chats)
        socket.emit("/chats", { chats: room?.chats, isChattingDisabled: !!room?.isChatDisabled });
    } else {
      console.log(`${userName} already added to the room`);
    }

    socket.on("/req", (data) => {
      roomManager.updateRoomInfo(roomID, data);
      socket.broadcast.to(roomID).emit("/sync", data);
    });

    socket.on("/set-video", (data) => {
      roomManager.setRoomVideo(roomID, data.url);
      socket.broadcast.to(roomID).emit("/get-video", data);
    });

    socket.on("/status", (data) => {
      const updatedRoom = roomManager.updateUserState(roomID, socket.id, data.status);

      const users = updatedRoom?.users
        ? updatedRoom.users
            // .filter((allUsers) => allUsers.socket.id !== socket.id)
            .map((u) => ({
              name: u.name,
              email: u.email,
              id: u.id,
              status: u.state,
              isAdmin: u.id === room.adminId,
            }))
        : [];

      socket.emit("/users", users);
      socket.broadcast.to(roomID).emit("/users", users);
    });

    socket.on("/chat", (data) => {
      const chatsList = roomManager.addChat(roomID, data.chat, {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      socket.emit("/chats", { chats: chatsList });
      socket.broadcast.to(roomID).emit("/chats", { chats: chatsList });
    });

    socket.on("/clear-chat", () => {
      const chatsList = roomManager.clearChats(roomID);

      socket.emit("/chats", { chats: chatsList });
      socket.broadcast.to(roomID).emit("/chats", { chats: chatsList });
    });

    socket.on("/disable-chat", (disabled) => {
      const chatsList = roomManager.disableChat(roomID, disabled);

      socket.emit("/chats", { chats: chatsList, isChattingDisabled: disabled });
      socket.broadcast
        .to(roomID)
        .emit("/chats", { chats: chatsList, isChattingDisabled: disabled });
    });

    // remove user from users list
    socket.on("disconnect", () => {
      roomManager.removeClient(roomID, socket.id);
      socket.broadcast.to(roomID).emit("/left-user", `${userName} left the room`);
      const users = room?.users
        ? room.users.map((u) => ({
            name: u.name,
            email: u.email,
            id: u.id,
            status: u.state,
            isAdmin: u.id === room.adminId,
          }))
        : [];
      socket.emit("/users", users);
      socket.broadcast.to(roomID).emit("/users", users);
      console.log(`a user left the room:${roomID}`);
    });
  });
}
