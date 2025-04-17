const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const ApiError = require("../utils/apiError");
const userService = require("../services/user.service");

module.exports = {
    getUserProjects: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const projects = await Project.find({ owner: userId });

            res.status(200).json({
                success: true,
                projects,
                length: projects.length,
            });
        } catch (e) {
            console.log("err creating project: ", e);
            next(e);
        }
    },

    createProject: async (req, res, next) => {
        try {
            const { name, description, status, members, deadline } = req.body;

            if (!name || !deadline) {
                return next(new ApiError(404, "Name or Deadline is empty!"));
            }

            // check each member exists or not
            const userIds = members.map((member) => member.user);
            await userService.validateUsers(userIds);

            const project = new Project({
                name,
                description,
                owner: req.user.id,
                status,
                members,
                deadline,
            });

            await project.save();

            return res.status(200).json({
                success: true,
                message: "New project created!",
                project,
            });
        } catch (e) {
            console.log("err creating project: ", e);
            next(e);
        }
    },

    getSingleProject: async (req, res, next) => {
        try {
            const { id: projectId } = req.params;
            const project = await Project.findById(projectId);
            if (!project) {
                return next(
                    new ApiError(
                        404,
                        `Project with ID: ${projectId} does not exist!`
                    )
                );
            }

            res.status(200).json({
                success: true,
                project,
            });
        } catch (e) {
            console.log("err getting single project: ", e);
            next(e);
        }
    },

    updateProject: async (req, res, next) => {
        try {
            const { name, description, status, deadline } = req.body;
            const { id: projectId } = req.params;

            if (!name || !deadline) {
                return next(new ApiError(404, "Name or Deadline is empty!"));
            }

            const toUpdate = {
                name,
                description,
                status,
                deadline,
            };

            const updatedProject = await Project.findOneAndUpdate(
                { _id: projectId },
                { $set: toUpdate },
                { new: true, runValidators: true }
            );

            if (!updatedProject) {
                return next(new ApiError(404, "Project not found!"));
            }

            return res.status(200).json({
                success: true,
                message: "Successfully Updated!",
                updatedProject,
            });
        } catch (e) {
            console.log("err updating project: ", e);
            next(e);
        }
    },
    deleteProject: async (req, res, next) => {
        try {
            const { id: projectId } = req.params;
            const project = await Project.findByIdAndDelete(projectId);
            if (!project) {
                return next(
                    new ApiError(
                        404,
                        `Project with ID: ${projectId} does not exist!`
                    )
                );
            }

            res.status(200).json({
                success: true,
                message: "Project successfully deleted!",
            });
        } catch (e) {
            console.log("err deleting project: ", e);
            next(e);
        }
    },

    createTaskUnderProject: async (req, res, next) => {
        try {
            const { id: projectId } = req.params;
            const { title, description, status, priority, tags, dueDate } =
                req.body;

            if (
                (!title || !description || !status || !priority || !tags.length,
                !dueDate)
            ) {
                return next(new ApiError(404, "All fields are required!"));
            }

            const projectExists = await Project.exists({ _id: projectId });
            if (!projectExists) {
                return next(new ApiError(404, "Project does not exist!"));
            }

            const newTask = new Task({
                title,
                description,
                status,
                project: projectId,
                priority,
                tags,
                dueDate,
                createdBy: req.user.id,
            });

            const savedTask = await newTask.save();

            const task = await Task.findOne({ _id: savedTask._id }).populate(
                "project",
                "name"
            );

            res.status(201).json({
                success: true,
                message: "A new task is successfully created",
                task,
            });
        } catch (e) {
            console.log("err creating task under project: ", e);
            next(e);
        }
    },

    getProjectTasks: async (req, res, next) => {
        try {
            const { id: projectId } = req.params;
            const tasks = await Task.find({ project: projectId });

            res.status(200).json({ success: true, tasks });
        } catch (e) {
            console.log("err creating project: ", e);
            next(e);
        }
    },

    updateProjectMembers: async (req, res, next) => {
        try {
            const { id: projectId } = req.params;
            const { members } = req.body;

            const project = await Project.findOne({ _id: projectId });
            if (!project) {
                return next(
                    new ApiError(
                        404,
                        `Project with ID: ${projectId} does not exist!`
                    )
                );
            }

            // check user exists
            const userIds = members.map((member) => member.user);
            await userService.validateUsers(userIds);

            // check users already members?
            for (const id of userIds) {
                const isMember = project.members.some(
                    (member) => member.user.toString() === id
                );

                if (isMember) {
                    return next(
                        new ApiError(
                            400,
                            `User already exists in this project!`
                        )
                    );
                }
            }

            project.members = members;
            await project.save();

            // Return updated project with populated member data
            const updatedProject = await Project.findById(projectId).populate(
                "members.user",
                "username email"
            );

            return res.status(200).json({
                success: true,
                message: "Project members updated successfully",
                project: updatedProject,
            });
        } catch (e) {
            console.log("err creating project: ", e);
            next(e);
        }
    },
    updateTaskAssignees: async (req, res, next) => {
        try {
            const { projectId, taskId } = req.params;
            const { assignees } = req.body;

            // check project exists
            const project = await Project.findById(projectId);
            if (!project) {
                return next(
                    new ApiError(
                        404,
                        `Project with ID: ${projectId} does not exist!`
                    )
                );
            }

            // Validate task exists in this project
            const task = await Task.findOne({
                _id: taskId,
                project: projectId,
            });
            if (!task) {
                return next(
                    new ApiError(
                        404,
                        `Task with ID: ${taskId} does not exist in this project!`
                    )
                );
            }

            const userIds = assignees.map((assignee) => assignee.user);

            // Validate users exist
            await userService.validateUsers(userIds);

            // check assignees are project members
            for (const userId of userIds) {
                const isMember = project.members.some(
                    (member) => member.user.toString() === userId
                );

                if (!isMember) {
                    return next(
                        new ApiError(
                            400,
                            `User ${userId} is not a member of this project!`
                        )
                    );
                }
            }

            task.assignees = assignees;
            await task.save();

            // Return updated task
            const updatedTask = await Task.findById(taskId).populate(
                "assignees.user",
                "username email"
            );

            return res.status(200).json({
                success: true,
                message: "Task assignees updated successfully",
                task: updatedTask,
            });
        } catch (error) {
            next(error);
        }
    },
};
