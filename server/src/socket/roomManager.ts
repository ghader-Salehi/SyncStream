import { redisClient } from "../lib/redisClient";

enum RoomType {
  TEMPORARY,
  PERMANENT,
}

interface Room {
  _id: string;
  name: string;
  title: string;
  type: RoomType;
  adminId: String;
  users: any[];
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

export function addClient(roomID: string, socket: any): Room[] {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].users.push(socket);
  }

  return rooms;
}

export function removeClient(roomID: string, id: string): Room[] {
  const foundRoomIndex = rooms.findIndex((r) => r._id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].users = rooms[foundRoomIndex].users.filter((u) => u.id !== id);
  }

  return rooms;
}

export function isClientExit(roomID: string, id: string) {
  const foundRoom = rooms.find((r) => r._id === roomID);

  if (foundRoom) {
    const foundUser = foundRoom.users.find((u) => u.id === id);
    return !!foundUser;
  }

  console.log("room not found");

  return false;
}
