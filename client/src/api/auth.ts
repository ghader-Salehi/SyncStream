import axios, { AxiosInstance } from "axios";

import { axiosWithAuth } from "./index";
import { REACT_APP_API_URL } from "../config";


const API_BASE = "/api/auth/user";

interface ILoginCredentials {
  email : string,
  password : string
}

interface IRegisterData {
  name : string,
  email : string,
  password : string
}

export let axiosWithoutAuth: AxiosInstance = axios.create({
  baseURL: REACT_APP_API_URL,
});


export async function login(credentials: ILoginCredentials) {
  return await axiosWithAuth.post(API_BASE + "/login", credentials);
}

export async function register(data: IRegisterData) {
  return await axiosWithAuth.post(API_BASE + "/register", data);
}

export async function logout() {
  return await axiosWithAuth.get(API_BASE + "/logout");
}

export async function grant(withoutAuth? : boolean) {
  if(withoutAuth) return await axiosWithoutAuth.get(API_BASE + "/grant");
  return await axiosWithAuth.get(API_BASE + "/grant");
}
