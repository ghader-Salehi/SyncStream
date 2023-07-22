import * as redis from "redis";

export let redisClient: redis.RedisClientType<redis.RedisDefaultModules>;

export async function buildRedisClient(): Promise<void> {
  redisClient = redis.createClient({
    socket: {
      //TODO: make host name dynamic
      host: "localhost",
      port: 6379,
    },
  });
  redisClient.on("error", (err) => console.log("Redis Server Error", err));
  redisClient.on("connect", () => {
    console.log("Connected to Redis server");
  });
  await redisClient.connect();
}
