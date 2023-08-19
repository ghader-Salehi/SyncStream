import { Router } from "express";
import { login, logout, register, grant } from "../controllers/auth";
import checkAuth from "../middlewares/check-auth";

const router = Router();

router.get("/grant", checkAuth, grant);
router.get("/user", checkAuth, () => {});
router.post("/login", checkAuth, login);
router.post("/register", checkAuth, register);
router.post("/logout", checkAuth, logout);


export default router;
