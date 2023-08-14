import { createServer } from "http";
import { Server } from "socket.io";
import { setup } from "./connectionManager"

export let io;

export function socketServer(app) {
  const server = createServer(app);
  io = new Server(server , {
    cors : {
      origin : "http://localhost:3000"
    }
  });

  server.listen(3030, () => {
    console.log("Socket is listening on 3030");
  });

  // add socket handlers
  setup();
}
