const taskController = require("../controllers/taskController");
const express = require("express");
const router = express.Router();

router
    .route("")
    .get(taskController.getAllUserTasks)
    .post(taskController.createStandaloneTask);

router
    .route("/:id")
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

router
    .route("/:taskId/comments")
    .get(taskController.getTaskComments)
    .post(taskController.createCommentUnderTask);

module.exports = router;
