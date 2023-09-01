import { Request, Response } from "express";
import prisma from "../lib/prismaClient";
import { redisClient } from "../lib/redisClient";
import { ObjectId } from "mongodb";
import * as roomManager from "../socket/roomManager"

// fetch only permanent rooms
export const getRooms = async (req: Request, res: Response) => {
  try {
    const allRooms = await prisma.room.findMany();

    res.status(200).json({
      status: "success",
      allRooms,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id as string;

    const cachedRoom = await redisClient.get(`room:${roomId}`);

    if (cachedRoom) {
      res.status(200).json({
        status: "success",
        room: JSON.parse(cachedRoom),
      });
    } else {
      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          users: true, // Include the related users in the response
        },
      });

      if (!room) {
        return res.status(404).json({ status: "failed", message: "Room not found." });
      }

      res.status(200).json({
        status: "success",
        room,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, title, type } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "failed",
        message: "name cannot be empty",
      });
    }

    if (!title) {
      return res.status(400).json({
        status: "failed",
        message: "title cannot be empty",
      });
    }

    if (!type) {
      return res.status(400).json({
        status: "failed",
        message: "type cannot be empty",
      });
    }

    // check that room does not exist in redis
    // if (await redisClient.exists(`room:${name}`)) {
    //   console.log("can't create room, already in redis");

    //   return res.status(400).json({
    //     status: "failed",
    //     message: "room name already exists in redis",
    //   });
    // }

    // check that room does not exist in data base
    const isRoomExist = await prisma.Room.findUnique({
      where: {
        name,
      },
    });

    if (isRoomExist) {
      return res.status(400).json({
        status: "failed",
        message: "room name already exists",
      });
    }

    // add in redis

    const newRoomId = new ObjectId();
    
    let returningRoom;

    const storingRoomInRedis = {
      _id: newRoomId.toString(),
      name,
      title,
      type,
      adminId: "",
      // users: [{ id: req.user.id }],
      users : []
    };

    await redisClient.set(`room:${newRoomId.toString()}`, JSON.stringify(storingRoomInRedis));
    console.log("New room created in redis:", storingRoomInRedis);
    returningRoom = storingRoomInRedis;

    if (type === "PERMANENT") {
      // add in db
      const room = await prisma.Room.create({
        data: {
          id: newRoomId.toString(),
          name,
          title,
          type,
          adminId: req.user.id,
          // users: {
          //   connect: [{ id: req.user.id }],
          // },
        },
      });

      console.log("New Permanent room created:", room);

      returningRoom = room;
    }

    await roomManager.update();

    res.status(200).json({
      status: "success",
      room : returningRoom,
    });
    

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
    console.log(error);
  }
};
export const updateRoom = async (req: Request, res: Response) => {
  // update the room in db
};
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.id as string;
    // delete the room from db
    const deletedRoom = await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    //TODO: delete it from cache

    res.status(200).json({
      status: "success",
      deletedRoom,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "server error",
    });
  }
};
