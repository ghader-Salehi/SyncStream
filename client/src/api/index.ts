import axios, { AxiosInstance } from "axios";
import { REACT_APP_API_URL } from "../config";

let authToken = "";
export let axiosWithAuth: AxiosInstance = axios.create({
  baseURL: REACT_APP_API_URL,
});

export function initAxios(token: string): void {
  if (token) authToken = `Bearer ${token}`;

  axiosWithAuth.interceptors.request.use(config => {
    config.headers['Authorization'] =  authToken;
    return config;
  });
}

