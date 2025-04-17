const ApiError = require("../utils/apiError");
const Comment = require("../models/commentModel");

module.exports = {
    updateComment: async (req, res, next) => {
        try {
            const { content } = req.body;
            const { commentId } = req.params;

            if (!content) {
                return next(new ApiError(404, "Must provide content!"));
            }

            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                {
                    $set: {
                        content,
                    },
                },
                { new: true, runValidators: true }
            ).populate("user", ["username", "email"]);

            if (!updatedComment) {
                return next(new ApiError(404, "Comment Not Found!"));
            }

            res.status(200).json({
                success: true,
                message: "Comment Successfully updated!",
                updatedComment,
            });
        } catch (e) {
            console.log("error updating comment", e);
            next(e);
        }
    },

    deleteComment: async (req, res, next) => {
        try {
            const { commentId } = req.params;

            const deletedComment = await Comment.findByIdAndDelete(commentId)
                .populate("task", ["title", "description"])
                .populate({ path: "user", select: "username email" });

            if (!deletedComment) {
                return next(new ApiError(404, "Comment Not Found!"));
            }

            res.status(200).json({
                success: true,
                message: "Comment Successfully deleted!",
                deletedComment,
            });
        } catch (e) {
            console.log("error deleting comment", e);
            next(e);
        }
    },
};
