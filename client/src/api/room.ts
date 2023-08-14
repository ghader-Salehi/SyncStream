import { axiosWithAuth } from "./index";

export async function createRoom(data: any) {
  return await axiosWithAuth.post("/create", data);
}

export async function getRooms(id: string) {
  return await axiosWithAuth.get(`/${id}`);
}

export async function updateRoom(id: string, data: any) {
  return await axiosWithAuth.get(`/${id}`, data);
}

export async function deleteRoom(id: string) {
  return await axiosWithAuth.delete(`/${id}`);
}
