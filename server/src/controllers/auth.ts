import { Request, Response } from "express";
import prisma from "../lib/prismaClient";
import { encryptPassword, comparePassword } from "../utils/password";
import generateToken from "../utils/token";
import { uniqueNamesGenerator, names, adjectives, NumberDictionary, colors } from "unique-names-generator";
import { v4 as uuid } from "uuid";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "failed",
        message: "name cannot be empty",
      });
    }

    if (!email) {
      return res.status(400).json({
        status: "failed",
        message: "email cannot be empty",
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "failed",
        message: "password cannot be empty",
      });
    }

    const isEmailExist = await prisma.User.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      return res.status(400).json({
        status: "failed",
        message: "email already exists, please try another email",
      });
    }

    const user = await prisma.User.create({
      data: {
        email,
        name,
        password: await encryptPassword(password),
      },
      select: {
        id: true,
        email: true,
        name: true,

      },
    });

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.info(error.message);
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "failed",
        message: "email cannot be empty",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: "failed",
        message: "password cannot be empty",
      });
    }

    const user = await prisma.User.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "account not found",
      });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Wrong password",
      });
    }
    res.status(200).json({
      status: "success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: await generateToken.accessToken(user),
    });
  } catch (error) {
    console.info(error.message);
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { access_token } = req.body;
    const token = await prisma.Token.delete({
      where: {
        token: access_token,
      },
    });
    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid token",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Logged Out Sucessfully",
    });
  } catch (error) {
    console.info(error.message);
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
  }
};

export const grant = async (req: Request, res: Response) => {
  try {
    const header = req.header("Authorization");

    // if the token exist return the received token.
    if (header) {
      const [type, token] = header.split(" ");

      if (type === "Bearer" && !!token) {
        //TODO: check if its not expired
        res.status(200).json({
          status: "success",
          token
        });
      }

      return;
    }
    // if not generate one.
    const randomUser = {
      id: uuid(),
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, colors ,names],
        style: "lowerCase",
      }),
      email: "",
    };

    res.status(200).json({
      status: "success",
      token: await generateToken.accessToken(randomUser),
    });
  } catch (error) {
    console.info(error.message);
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
  }
};
