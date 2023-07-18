const { PORT, JWT_SECRET_KEY } = process.env;

export const port = PORT || 3000;
export const jwtSecretKey = JWT_SECRET_KEY;
