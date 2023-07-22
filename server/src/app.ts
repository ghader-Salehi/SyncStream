import express from "express";
import router from "./routes";
import cors from "cors";
import { buildRedisClient } from "./lib/redisClient";
import { socketServer } from "./socket";
import { start } from "./socket/roomManager"

const app = express();

export async function main() {


  app.use(express.json());
  app.use(cors({ origin: "*" }));

  // create a redis client and connect to redis.
  await buildRedisClient();

  app.use("/api", router);

  // TODO: replace it with not-found.ts middleware
  app.all("*", (_, res) => {
    res.status(404).send("Sorry, the route you are going to does not exist");
  });

  // express server listening
  app.listen(8080, () => {
    console.log(`Server is running on 8080`);
  });

  // socket.io setup
  await socketServer(app);
  await start()
}

main();
