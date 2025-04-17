const commentController = require("../controllers/commentController");
const express = require("express");
const router = express.Router();

router
    .route("/:commentId")
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;
