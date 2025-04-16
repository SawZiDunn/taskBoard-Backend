const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: String,

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "completed", "archived"],
            default: "active",
        },

        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                role: {
                    type: String,
                    enum: ["owner", "member"],
                    default: "member",
                },
            },
        ],

        deadline: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
