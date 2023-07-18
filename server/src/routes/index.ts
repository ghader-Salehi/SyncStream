import { Router } from "express";
import auth from "./auth";
import room from "./room";

const router = Router();

router.use("/auth/user", auth);
router.use("/room",  room);

export default router;
