import axios from "axios";
import { REACT_APP_API_URL } from "../config";

let token = "";

export function setToken(token: string): void {
  if (token) token = `Bearer ${token}`;
}

export const axiosWithAuth = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: {
    Authorization: token,
  },
});

export const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL,
});
