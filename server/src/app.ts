import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import router from "./routes";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api", router);

// TODO: replace it with not-found.ts middleware
app.all("*", (_, res) => {
  res.status(404).send("Sorry, the route you are going to does not exist");
});

// Server listening
app.listen(8080, () => {
  console.log(`Server is running on 8080`);
});

// Socket listening
server.listen(3000, () => {
  console.log("Socket is listening on 3000");
});

// socket.io handlers
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("/join", (data) => {
    
  });

  socket.on("/auth", (data) => {

  });


  socket.on("/req", (data) => {

  });


  socket.emit('/sync', 'send some details to users for getting sync');

  // remove user from users list
  socket.on("disconnect", () => {

  });
});
