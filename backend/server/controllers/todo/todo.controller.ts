import User from "../../models/user";
import { Response } from "express";
import { AuthReq } from "../../middlewares/authmw";

export const getTodos = async (req: AuthReq, res: Response): Promise<void> => {
  try {
    console.log("Incoming request to get todos for user:", req.user?.userId);
    const user = await User.findById(req.user?.userId);
    console.log(" user:", user);
    if (!user) {
      console.error("User not found:", req.user?.userId);
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log("Fetched todos:", user.todos);
    res.json({ todos: user.todos });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ message: "Error fetching todos" });
  }
};

export const addTodo = async (req: AuthReq, res: Response): Promise<void> => {
  try {
    console.log("Incoming request to add todo for user:", req.user?.userId);

    const { todo } = req.body;

    if (!todo) {
      console.error("Todo text is missing in request body.");
      res.status(400).json({ message: "Todo text is required" });
      return;
    }

    console.log("Adding todo:", todo);

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { $push: { todos: { todo, completed: false } } },
      { new: true }
    );

    if (!user) {
      console.error("User not found:", req.user?.userId);
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("Todo added. New todos list:", user.todos);
    res.json({ message: "Todo added", todos: user.todos });
  } catch (err) {
    console.error("Error adding todo:", err);
    res.status(500).json({ message: "Error adding todo" });
  }
};

export const updateTodo = async (
  req: AuthReq,
  res: Response
): Promise<void> => {
  try {
    const { todo, completed } = req.body;
    const { id } = req.params;

    console.log("Incoming request to update todo with ID:", id);

    const user = await User.findOne({ "todos._id": id });

    if (!user) {
      console.error("User not found for todo ID:", id);
      res.status(404).send("User not found");
      return;
    }

    const todoIndex = user.todos.findIndex((t) => t._id.toString() === id);
    console.log(`Todo found at index: ${todoIndex}`);

    if (todoIndex === -1) {
      console.error("Todo not found with ID:", id);
      res.status(404).send("Todo not found");
      return;
    }

    user.todos[todoIndex].todo = todo;
    user.todos[todoIndex].completed = completed;

    console.log("Updated todo:", user.todos[todoIndex]);

    await user.save();

    res.status(200).json({ todo: user.todos[todoIndex] });
  } catch (error) {
    console.error("Error during todo update:", error);
    res.status(500).send("Server error");
    return;
  }
};

export const deleteTodo = async (
  req: AuthReq,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    console.log("Incoming request to delete todo with ID:", id);

    const user = await User.findOneAndUpdate(
      { "todos._id": id },
      { $pull: { todos: { _id: id } } },
      { new: true }
    );

    if (!user) {
      console.error("Todo not found with ID:", id);
      res.status(404).send("Todo not found");
      return;
    }

    console.log("Todo deleted successfully with ID:", id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error during todo deletion:", error);
    res.status(500).send("Server error");
    return;
  }
};
