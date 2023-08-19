import { axiosWithAuth } from "./index";

const API_BASE = "/api/auth/user";

export async function login(credentials: any) {
  return await axiosWithAuth.post(API_BASE + "/login", credentials);
}

export async function register(data: any) {
  return await axiosWithAuth.post(API_BASE + "/register", data);
}

export async function logout() {
  return await axiosWithAuth.get(API_BASE + "/logout");
}

export async function grant() {
  return await axiosWithAuth.get(API_BASE + "/grant")
}