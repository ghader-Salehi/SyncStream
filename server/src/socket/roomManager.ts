import { redisClient } from "../lib/redisClient";
import { v4 as uuid } from "uuid";

enum RoomType {
  TEMPORARY,
  PERMANENT,
}

export type PlayerState = "paused" | "buffering" | "playing" | "ready" | "unready";

interface VideoInfo {
  playing: boolean;
  played: number;
}
interface User {
  id: string;
  name: string;
  email: string;
  state?: PlayerState;
}

interface UserSocketConnection extends User {
  socket: any;
}

interface Chat {
  id: string;
  content: string;
  sender: User;
}

interface Room {
  _id: string;
  name: string;
  title: string;
  type: RoomType;
  adminId: string;
  info: VideoInfo;
  videoUrl: string;
  users: UserSocketConnection[];
  chats: Chat[];
  isChatDisabled: boolean;
}

export let rooms: Room[] = [];

export async function start() {
  //TODO: check mongo for rooms list
  const keys = await redisClient.keys("room:*");
  for (const roomKey of keys) {
    const text = await redisClient.get(roomKey);
    if (!text) {
      continue;
    }
    const room = JSON.parse(text);
    rooms.push(room);
  }
}

export async function update() {
  const keys = await redisClient.keys("room:*");
  const newList = [];
  for (const roomKey of keys) {
    const text = await redisClient.get(roomKey);
    if (!text) {
      continue;
    }
    const room = JSON.parse(text);
    newList.push(room);
  }

  rooms = newList;
}

export function addClient(roomID: string, socket: any, user: User): Room[] {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].users.push({ socket, ...user });
  }

  return rooms;
}

export function removeClient(roomID: string, id: string): Room[] {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].users = rooms[foundRoomIndex].users.filter((u) => u.socket?.id !== id);
  }

  return rooms;
}

export function isClientExit(roomID: string, id: string) {
  const foundRoom = rooms.find((r) => r._id === roomID);

  if (foundRoom) {
    const foundUser = foundRoom.users.find((u) => u.socket?.id === id);
    return !!foundUser;
  }

  console.log("room not found");

  return false;
}

export function updateRoomInfo(roomID: string, info: VideoInfo) {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].info = info;
  }

  return rooms;
}

export function setRoomVideo(roomID: string, url: string) {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].videoUrl = url;
  }

  return rooms;
}

export function updateUserState(roomID: string, socketId: string, state: PlayerState) {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomID);

  if (foundRoomIndex !== -1) {
    const foundUserIndex = rooms[foundRoomIndex].users.findIndex((u) => u.socket.id === socketId);
    if (foundUserIndex !== -1) rooms[foundRoomIndex].users[foundUserIndex].state = state;
  }

  return rooms[foundRoomIndex];
}

export function getRoomConnections(roomID: string) {
  const foundRoom = rooms.find((r) => r._id === roomID);

  if (foundRoom) return foundRoom.users;

  return [];
}

export function getRoomChats(roomId: string) {
  const foundRoom = rooms.find((r) => r._id === roomId);

  if (foundRoom) return foundRoom.chats;

  return [];
}

export function addChat(roomId: string, content: string, sender: User) {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomId);
  if (foundRoomIndex !== -1) {
    const userPrevState: PlayerState = rooms[foundRoomIndex].users.find(
      (u) => u.id === sender.id
    ).state;

    const chat: Chat = {
      id: uuid(),
      content,
      sender: {
        ...sender,
        state: userPrevState,
      },
    };
    if (rooms[foundRoomIndex]?.chats) rooms[foundRoomIndex]?.chats.push(chat);
    else rooms[foundRoomIndex].chats = [chat];
  }

  return rooms[foundRoomIndex].chats;
}

export function clearChats(roomId: string) {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomId);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].chats = [];
  }

  return rooms[foundRoomIndex].chats;
}

export function disableChat(roomId: string, disabled: boolean) {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomId);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].isChatDisabled = disabled;
  }

  return rooms[foundRoomIndex].chats;
}
