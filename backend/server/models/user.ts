import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  todos: { type: [TodoSchema], default: [] },
});

const User = mongoose.model("User", UserSchema);

export default User;
