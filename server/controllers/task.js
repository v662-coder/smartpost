import TaskModel from "../models/taskSchema.js";
import HttpStatus from "../constants/http-status.constant.js";
import ToastyConstant from "../constants/toasty.constant.js";

const addTask = async (req, res) => {
    try {
        const { title, description, priority, selectedDate } = req.body;

        if (!title || !title.trim() || !description || !description.trim() || !priority || !selectedDate || isNaN(Date.parse(selectedDate))) {
            return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "Title, description, priority and due date are all required" });
        }

        if (!req.user || !req.user._id) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ status: false, message: "Authorization Failed" });
        }
        const authorId = req.user._id.toString();

        const newTask = new TaskModel({
            title: title.trim(),
            description,
            priority,
            deadline: selectedDate,
            authorId,
            createdAt: new Date(),
            taskStatus: "todo"
        })
        const savedTask = await newTask.save();
        if (savedTask) {
            return res.status(201).json({ status: true, message: "Task created successfully", task: savedTask });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: "Something Went Wrong" });
        }

    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

const removeTask = async (req, res) => {
    try {

        const authorId = req.user._id.toString();
        const { taskId } = req.params;
        const task = await TaskModel.findOne({ authorId, _id: taskId });
        if (!task) {
            return res.status(HttpStatus.NOT_FOUND).json({ status: false, message: "Task not found" });
        }
        
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        if (deletedTask) {
            return res.status(HttpStatus.OK).json({ status: true, message: "Task Deleted Successfully" });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: "Something Went Wrong" });
        }
    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }

}

// Quick status change (used for drag-and-drop between columns / status-cycle button)
const editTask = async (req, res) => {
    try {
        const authorId = req.user._id.toString();
        const { taskId, taskStatus } = req.params;

        const validStatuses = ["todo", "ongoing", "completed"];
        if (!validStatuses.includes(taskStatus)) {
            return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "Invalid task status" });
        }

        const updatedTask = await TaskModel.findOneAndUpdate(
            { authorId, _id: taskId },
            { $set: { taskStatus, updatedAt: new Date() } },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(HttpStatus.NOT_FOUND).json({ status: false, message: "Task not found or unauthorized" });
        }

        return res.status(HttpStatus.OK).json({ status: true, message: "Task Status Updated Successfully", task: updatedTask });

    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

// Full task edit (title, description, priority, due date, and/or status) used by the Edit Task form
const editTaskDetails = async (req, res) => {
    try {
        const authorId = req.user._id.toString();
        const { taskId } = req.params;
        const { title, description, priority, selectedDate, taskStatus } = req.body;

        const task = await TaskModel.findOne({ authorId, _id: taskId });
        if (!task) {
            return res.status(HttpStatus.NOT_FOUND).json({ status: false, message: "Task not found or unauthorized" });
        }

        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "Title cannot be empty" });
            }
            task.title = title.trim();
        }
        if (description !== undefined) {
            if (!description.trim()) {
                return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "Description cannot be empty" });
            }
            task.description = description;
        }
        if (priority !== undefined) {
            if (!["Low", "Moderate", "High", "Critical"].includes(priority)) {
                return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "Invalid priority" });
            }
            task.priority = priority;
        }
        if (selectedDate !== undefined) {
            if (isNaN(Date.parse(selectedDate))) {
                return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "Invalid due date" });
            }
            task.deadline = selectedDate;
        }
        if (taskStatus !== undefined) {
            if (!["todo", "ongoing", "completed"].includes(taskStatus)) {
                return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: "Invalid task status" });
            }
            task.taskStatus = taskStatus;
        }

        task.updatedAt = new Date();
        const updatedTask = await task.save();

        return res.status(HttpStatus.OK).json({ status: true, message: "Task updated successfully", task: updatedTask });

    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

const getAllTask = async (req, res) => {
    try {
        const { taskStatus } = req.query;
        const authorId = req.user._id.toString();

        const filter = { authorId };
        if (taskStatus) {
            filter.taskStatus = taskStatus;
        }

        const tasks = await TaskModel.find(filter);
        res.status(HttpStatus.OK).json({ status: true, message: "Data Fetched Successfully", tasks });

    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

export { addTask, removeTask, editTask, editTaskDetails, getAllTask };