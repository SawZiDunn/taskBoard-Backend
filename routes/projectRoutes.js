const projectController = require("../controllers/projectController");
const express = require("express");
const router = express.Router();

router.get("/mine", projectController.getUserProjects);
router.post("", projectController.createProject);

router
    .route("/:id")
    .get(projectController.getSingleProject)
    .delete(projectController.deleteProject)
    .put(projectController.updateProject);

router
    .route("/:id/tasks")
    .get(projectController.getProjectTasks)
    .post(projectController.createTaskUnderProject);

router.put("/:id/members", projectController.updateProjectMembers);
router.put(
    "/:projectId/tasks/:taskId/assignees",
    projectController.updateTaskAssignees
);

module.exports = router;
