import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config";

const generateToken = {
  accessToken: async (payload) => {
    return jwt.sign(
      { id: payload.id, email: payload.email },
      jwtSecretKey,
      {
        expiresIn: "1h",
      }
    );
  },
};

export default generateToken;
