const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.ObjectId,
            ref: "Task",
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
