import { Request, Response } from "express";
import prisma from "../lib/prisma";


export const getRooms = async(req: Request, res: Response)=>{
    // fetch only permanent rooms
};

export const getRoom = async(req: Request, res: Response)=> {
    // get a single room by id from db
}

export const createRoom = async(req: Request, res: Response)=>{
    // check that room does not exist in data base
    // check that room does not exist in redis

    // write is data base if its permanent
    // else write it in redis
};
export const updateRoom = async(req: Request, res: Response)=>{
    // update the room in db
};
export const deleteRoom = async(req: Request, res: Response)=>{
    // delete the room from db
};

