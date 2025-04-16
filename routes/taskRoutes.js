const taskController = require("../controllers/taskController");
const express = require("express");
const router = express.Router();

router
    .route("")
    .get(taskController.getAllUserTasks)
    .post(taskController.createStandaloneTask);

router.post("/projects/:id/tasks", taskController.createTaskUnderProject);
router.get("/projects/:id/tasks", taskController.getProjectTasks);

router
    .route("/:id")
    .put(taskController.updateTask)
    .delete(taskController.delateTask);

module.exports = router;
