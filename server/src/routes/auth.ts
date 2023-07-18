import { Router } from "express";
import { login, logout, register } from "../controllers/auth";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/", ()=>{});

export default router;
