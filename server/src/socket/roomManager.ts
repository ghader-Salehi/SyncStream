import { redisClient } from "../lib/redisClient";
import EventEmitter from "events";

enum RoomType {
  TEMPORARY,
  PERMANENT,
}

interface VideoInfo {
  playing: boolean;
  played: number;
}
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserSocketConnection extends User {
  socket: any;
}

interface Room {
  _id: string;
  name: string;
  title: string;
  type: RoomType;
  adminId: String;
  info: VideoInfo;
  users: UserSocketConnection[];
}

export let rooms: Room[] = [];

export async function start() {
  // check mongo for rooms list
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

export function getRoomConnections(roomID: string) {
  const foundRoom = rooms.find((r) => r._id === roomID);

  if (foundRoom) return foundRoom.users;

  return [];
}
