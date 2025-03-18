import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;
  console.log("Register called with:", username, password);
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    console.log("Missing arguments, stopping..");
    return;
  }

  try {
    console.log("trying");
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      console.log("Username exists..");
      return;
    } else {
      console.log("Username doesnt exist, continuing");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("password hashed");

    const newUser = new User({ username, password: hashedPassword });
    console.log("saving user");

    await newUser.save();
    console.log("saved user");

    res.status(201).json({ message: "Registered, please log in." });
  } catch (err) {
    console.error("Error during registragion: ", err);
    res.status(500).json({ message: "Error registering user" });
    return;
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // console.log(req.body);

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // const isMatch = password === user.password; // testing and only for testing.
    console.log(`Password match: ${isMatch}`);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, id: user._id });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Error logging in" });
    return;
  }
};
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
};
