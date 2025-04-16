const projectController = require("../controllers/projectController");
const express = require("express");
const router = express.Router();

router
    .route("/projects/:id/tasks")
    .get(projectController.getProjectTasks)
    .post(projectController.createTaskUnderProject);

module.exports = router;
