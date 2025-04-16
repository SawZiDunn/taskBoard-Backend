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

        tags: {
            type: [String],
            validate: {
                validator: (input) => input.length <= 3,
                // msg will be shown if validator returns false
                message: (props) =>
                    `Maximum 3 tags allowed, but got ${props.value.length} tags.`,
            },
        },

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
                validate: {
                    validator: (members) => members.length <= 3,
                    message: (props) =>
                        `Maximum 3 members to assign, but ${props.value.length} provided!`,
                },
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
