import type { Request, Response } from "express";
import User from "../models/user";


export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({
        error: "Validation error: userId must be a valid ObjectId",
        details: error,
      });
    } else {
      res.status(500).json({ error: "Error fetching user" });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;
    const user = new User({
      username,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ error: "Validation error", details: (error as any).errors });
    } else {
      res.status(400).json({ error: "Error creating user" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, email } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.updatedAt = new Date();
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({
        error: "Validation error: userId must be a valid ObjectId",
        details: error,
      });
    } else if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        error: "Validation error: username or email is invalid",
        details: (error as any).errors,
      });
    } else {
      res.status(500).json({ error: "Error updating user" });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({
        error: "Validation error: userId must be a valid ObjectId",
        details: error,
      });
    } else {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
};
