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

module.exports = router;
