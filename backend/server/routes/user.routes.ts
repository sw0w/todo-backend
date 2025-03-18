import express from "express";
import authMW from "../middlewares/authmw";
import { getUser } from "../controllers/user.controller";
const router = express.Router();

router.get("/:id", authMW, getUser);

export default router;
