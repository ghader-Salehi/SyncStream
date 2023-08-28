import { axiosWithAuth } from "./index";

const API_BASE = "/api/room";

export async function createRoom(data: any) {
  return await axiosWithAuth.post(API_BASE + "/create", data);
}

export async function getRooms() {
  return await axiosWithAuth.get(API_BASE + `/list`);
}

export async function updateRoom(id: string, data: any) {
  return await axiosWithAuth.get(API_BASE + `/${id}`, data);
}

export async function deleteRoom(id: string) {
  return await axiosWithAuth.delete(API_BASE + `/${id}`);
}
