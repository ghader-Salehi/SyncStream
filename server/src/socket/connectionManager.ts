import { io } from "./index";
import * as roomManager from "./roomManager";
import { Client } from "../models/client";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export const connections: Client[] = [];

function getUser(token: string): {} | null {
  let user = {};

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

  console.log(user);
  
  return user;
}

export async function setup() {
  io.on("connection", (socket) => {
    // TODO: generate a token for every connection

    const roomID = socket.handshake.query.id;
    const token = socket.handshake.headers.token;
    const user = getUser(token);    

    if (user) {
      // get user from token and add it to users list
      console.log(user);
      
    } else {
      if (!roomManager.isClientExit(roomID, socket)) {
        socket.join(roomID);
        const client = new Client(`room ${uuidv4()}`, roomID, socket);
        connections.push(client);
        roomManager.addClient(roomID, socket);
        socket.broadcast.to(roomID).emit("/user", "new user joined to the room");
      }
      else {
        console.log("client already added to room");
        
      }
    }

    socket.on("/auth", () => {
      // check user auth with recieved token before
    });

    socket.on("/req", () => {
      // request for changing video status

      socket.emit("/sync", "for making video sync between users");
    });

    // socket.emit("/sync", "for making video sync between users");
    // socket.emit("/event", "noify usres about any change happened in room");
    // socket.emit("/user", "notify users for joining new member");
    // socket.emit("/chat", "for getting new chats");

    // remove user from users list
    socket.on("disconnect", (socket) => {
      roomManager.removeClient(roomID, socket);
    });
  });
}
