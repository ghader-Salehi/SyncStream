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
    // const userId = user ? user.id : socket.id;
    const userName = user.name;

    if (!roomManager.isClientExit(roomID, socket.id)) {
      socket.join(roomID);
      const client = new Client(`room:${roomID}`, uuidv4(), socket, user ? token : "");
      connections.push(client);
      roomManager.addClient(roomID, socket, { id: user.id, name: user.name, email: user.email });
      // console.log(`a user joined in room:${roomID}`);
      socket.broadcast.to(roomID).emit("/user", `${userName} joined the room`);
    } else {
      console.log(`${userName} already added to the room`);
    }

    socket.on("/auth", () => {
      // check user auth with recieved token before
    });

    socket.on("/req", (data) => {
      // request for changing video status

      socket.broadcast.to(roomID).emit("/sync", data);
    });

    socket.on("/set-video", (data) => {
      // request for changing video status
      console.log(data);

      socket.broadcast.to(roomID).emit("/get-video", data);
    });

    // socket.emit("/sync", "for making video sync between users");
    // socket.emit("/event", "noify usres about any change happened in room");
    // socket.emit("/user", "notify users for joining new member");
    // socket.emit("/chat", "for getting new chats");

    // remove user from users list
    socket.on("disconnect", () => {
      roomManager.removeClient(roomID, socket.id);
      socket.broadcast.to(roomID).emit("/user", `${userName} left the room`);
      console.log(`a user left the room:${roomID}`);
    });
  });
}
