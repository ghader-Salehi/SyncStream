import { axiosWithAuth, axiosInstance } from "./index";

export async function login(credentials: any) {
  return await axiosInstance.post("/login", credentials);
}

export async function register(data: any) {
  return await axiosInstance.post("/register", data);
}

export async function logout() {
  return await axiosWithAuth.get("/logout");
}
