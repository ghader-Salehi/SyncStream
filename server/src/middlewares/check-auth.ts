import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    let token = "";

    // if (!header) {
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "Token not provided",
    //   });
    // }

    if (header) {
      const [_, splittedToken] = header.split(" ");
      token = splittedToken;
    }

    // if (type !== "Bearer") {
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "the type must be bearer",
    //   });
    // }

    // if (!token) {
    //   return res.status(401).json({
    //     status: "failed",
    //     message: "No token, authorization denied",
    //   });
    // }

    if (header && token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
        if (error) {
          return res.status(401).json({ status: "failed", message: error.message });
        }

        if (decoded && decoded.exp) {
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            return res.status(401).json({
              status: "failed",
              message: "Token expired, please login",
            });
          }
        }

        req.user = decoded;
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);

    console.error("something wrong with auth middleware");
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};
