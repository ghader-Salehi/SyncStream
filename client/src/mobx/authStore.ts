import { makeObservable, observable, action } from "mobx";

interface IUser {
  name: string;
  email: string;
  id: string;
}
export class AuthInfo {
  token: string = localStorage.getItem("ss_token") || "";
  user: IUser | null = localStorage.getItem("ss_user")
    ? JSON.parse(localStorage.getItem("ss_user") as string)
    : null;

  constructor() {
    makeObservable(this, {
      token: observable,
      user: observable,
      setToken: action,
      setUser: action,
    });
  }

  setToken(token: string) {
    this.token = token;
  }

  setUser(user: IUser | null) {
    this.user = user;
  }
}

export const AuthStore = new AuthInfo();
