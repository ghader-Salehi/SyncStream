import { redisClient } from "../lib/redisClient";

enum RoomType {
  TEMPORARY,
  PERMANENT,
}

interface Room {
  id: string;
  name: string;
  title: string;
  type: RoomType;
  adminId: String;
  users: any[];
}

export let rooms: Room[] = [];

export async function start() {
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

export async function addClient(roomID: string, socket: any) {
  const foundRoomIndex = rooms.findIndex((r) => r.id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].users.push(socket);
  }
}

export async function removeClient(roomID: string, socket: any) {
  const foundRoomIndex = rooms.findIndex((r) => r.id === roomID);

  if (foundRoomIndex !== -1) {
    rooms[foundRoomIndex].users = rooms[foundRoomIndex].users.filter((u) => u.id !== socket.id);
  }
}

export async function isClientExit(roomID: string, socket: any) {
  const foundRoom = rooms.find((r) => r.id === roomID);
  const foundUser = foundRoom.users.find((u) => u.id !== socket.id);
  return !!foundUser;
}
