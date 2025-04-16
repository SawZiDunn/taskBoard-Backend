const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,

        status: {
            type: String,
            enum: ["todo", "in progress", "done"],
            default: "todo",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        tags: [String],

        dueDate: Date,
        completedAt: Date,

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null, // null for stand-alone tasks
        },

        // who the task assigned to
        assignees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
