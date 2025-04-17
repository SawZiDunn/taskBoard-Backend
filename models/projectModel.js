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

/* for schmea level validations

- presave middleware
ProjectSchema.pre("save", callback(next) {} )

- custom validation
name {
    type: String,
    validate: {
        validator: function(name),
        message: props => "works when validator function returns false", props.value = name
        
    
        }
}
*/

module.exports = mongoose.model("Project", ProjectSchema);
