import express from "express";
import authMW from "../middlewares/authmw";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todo/todo.controller";

const router = express.Router();

router.get("/", authMW, getTodos);
router.post("/", authMW, addTodo);
router.put("/:id", authMW, updateTodo);
router.delete("/:id", authMW, deleteTodo);

export default router;
