const ApiError = require("../utils/apiError");
const Task = require("../models/taskModel");
const Comment = require("../models/commentModel");

module.exports = {
    createStandaloneTask: async (req, res, next) => {
        try {
            const { title, description, status, priority, tags, dueDate } =
                req.body;

            if (
                (!title || !description || !status || !priority || !tags.length,
                !dueDate)
            ) {
                return next(new ApiError(404, "All fields are required!"));
            }

            const newTask = new Task({
                title,
                description,
                status,
                priority,
                tags,
                dueDate,
                createdBy: req.user.id,
            });

            await newTask.save();
            res.status(201).json({
                success: true,
                message: "A new task is successfully created",
                task: newTask,
            });
        } catch (e) {
            console.log("Err at creating new task!", e);
            next(e);
        }
    },

    getAllUserTasks: async (req, res, next) => {
        try {
            let user = req.user;
            const tasks = await Task.find({ createdBy: user.id });

            res.status(200).json({
                success: true,

                tasks,
                length: tasks.length,
            });
        } catch (e) {
            console.log("Err getting tasks!", e);
            next(e);
        }
    },

    deleteTask: async (req, res, next) => {
        try {
            let { id: taskId } = req.params;
            console.log(taskId);
            const deletedTask = await Task.findByIdAndDelete(taskId);

            res.status(200).json({
                success: true,
                message: "Successfully deleted",

                deletedTask,
            });
        } catch (e) {
            console.log("Err deleting task!", e);
            next(e);
        }
    },
    updateTask: async (req, res, next) => {
        try {
            const { title, description, status, priority, tags, dueDate } =
                req.body;

            const { id: taskId } = req.params;

            const updates = {};
            if (title !== undefined) updates.title = title;
            if (description !== undefined) updates.description = description;
            if (status !== undefined) updates.status = status;
            if (priority !== undefined) updates.priority = priority;
            if (tags !== undefined) updates.tags = tags;
            if (dueDate !== undefined) updates.dueDate = dueDate;

            const task = await Task.findById(taskId);
            if (!task) {
                return next(new ApiError(404, "Task does not exist."));
            }

            // ObjectId to String
            if (task.createdBy.toString() != req.user.id) {
                return next(new ApiError(404, "User not authorized!"));
            }

            const updatedTask = await Task.findOneAndUpdate(
                { _id: taskId },
                {
                    $set: updates, // use set to partially update, put replace entire doc
                },
                { new: true, runValidators: true }
            );

            res.status(201).json({
                success: true,
                message: "task updated",
                updatedTask,
            });
        } catch (e) {
            console.log("Err updating task!", e);
            next(e);
        }
    },

    createCommentUnderTask: async (req, res, next) => {
        try {
            const { taskId } = req.params;
            const { content } = req.body;

            const newComment = new Comment({
                content,
                task: taskId,
                user: req.user.id,
            });

            await newComment.save();

            res.status(201).json({
                success: true,
                message: "Comment added",
                newComment,
            });
        } catch (e) {
            next(e);
        }
    },
    getTaskComments: async (req, res, next) => {
        try {
            const { taskId } = req.params;
            // populate joins Comment & User Model, adding username to comments
            // user in Comment is replaced by _id + username fro User Collection
            // if username is not specified, entire user obj will replace user id in comments

            const comments = await Comment.find({ task: taskId }).populate(
                "user",
                "username"
            );

            res.status(200).json({
                success: true,
                comments,
                length: comments.length,
            });
        } catch (e) {
            next(e);
        }
    },
};
