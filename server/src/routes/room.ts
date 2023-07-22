import { Router } from "express";
import {
  getRooms,
  createRoom,
  deleteRoom,
  updateRoom,
  getRoom,
} from "../controllers/room";
import checkAuth from "../middlewares/check-auth";
const router = Router();

router.get("/list", checkAuth, getRooms);
router.get("/:id", checkAuth, getRoom);
router.post("/create", checkAuth, createRoom);
router.put("/:id", checkAuth, updateRoom);
router.delete("/:id", checkAuth, deleteRoom);

export default router;
