import { makeObservable, observable, action } from "mobx";

export class AuthInfo {
  token: string = "";

  constructor() {
    makeObservable(this, {
      token: observable,
      setToken: action,
    });
  }

  setToken(token: string) {
    this.token = token;
  }
}

export const AuthStore = new AuthInfo();
