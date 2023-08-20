import io from "socket.io-client";
import { REACT_APP_SOCKET_URL } from "../config";
import { authToken } from "api";

export function connectToSocket(roomId: string) {
  const URL = REACT_APP_SOCKET_URL || "http://localhost:3030";
  const socket = io(URL, {
    query: {
      id: roomId,
    },
    auth: {
       token : authToken,
    },
  });

  return socket;
}
