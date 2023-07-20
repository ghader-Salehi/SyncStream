const { PORT, JWT_SECRET_KEY, REDIS_DATABASE_URL } = process.env;

export const port = PORT || 3030;
export const jwtSecretKey = JWT_SECRET_KEY;
export const redisUrl = REDIS_DATABASE_URL
