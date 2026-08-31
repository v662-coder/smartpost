import express from 'express';
import { addTask, editTask, editTaskDetails, getAllTask, removeTask } from '../controllers/task.js';
import userAuthentication from '../middleware/userAuthentication.js';

const task = express.Router();

// CREATE
task.post("/", userAuthentication, addTask);

// READ
task.get("/", userAuthentication, getAllTask);

// UPDATE (full edit: title/description/priority/due date/status)
task.patch("/:taskId", userAuthentication, editTaskDetails);

// UPDATE (quick status-only change, used by drag-and-drop)
task.patch("/:taskId/status/:taskStatus", userAuthentication, editTask);

// DELETE
task.delete("/:taskId", userAuthentication, removeTask);

export default task;