import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:taskId', getTaskById);
router.post('/', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;