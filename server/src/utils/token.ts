import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config";

const generateToken = {
  accessToken: async (payload) => {
    return jwt.sign({ id: payload.id, email: payload.email, name: payload.name }, jwtSecretKey, {
      expiresIn: "5h",
    });
  },
};

export default generateToken;
