import type { Request, Response } from "express";
import Task from "../models/task";
// import Comment from "../models/task";
// import Attachment from "../models/task";

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate("comments")
      .populate("attachments");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId)
      .populate("comments")
      .populate("attachments");

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({ error: "Validation error", details: error });
    } else {
      res.status(500).json({ error: "Error fetching task" });
    }
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority = req.body.priority || undefined,
      projectId,
      labels = req.body.labels || undefined,
      createdBy,
    } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      priority: priority === undefined ? undefined : priority,
      projectId,
      labels: labels === undefined ? undefined : labels,
      comments: [],
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ error: "Validation error", details: (error as any).errors });
    } else {
      res.status(500).json({ error: "Error creating task" });
    }
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const taskUpdates = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, taskUpdates, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ error: "Validation error", details: (error as any).errors });
    } else {
      res.status(500).json({ error: "Error updating task" });
    }
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({ error: "Validation error", details: error });
    } else {
      res.status(500).json({ error: "Error deleting task" });
    }
  }
};
