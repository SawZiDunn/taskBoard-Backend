const projectController = require("../controllers/taskController");
const express = require("express");
const router = express.Router();

router.post("/projects/:id/tasks", taskController.createTaskUnderProject);
router.get("/projects/:id/tasks", taskController.getProjectTasks);

module.exports = router;
