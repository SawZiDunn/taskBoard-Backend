const projectController = require("../controllers/projectController");
const express = require("express");
const router = express.Router();

router.route("").post(projectController.createProject);

router
    .route("/:id")
    .get(projectController.getSingleProject)
    .delete(projectController.deleteProject)
    .put(projectController.updateProject);

router
    .route("/:id/tasks")
    .get(projectController.getProjectTasks)
    .post(projectController.createTaskUnderProject);

router.post("/:id/members", projectController.addMembersToProject);
router.delete(
    "/:id/members/:userId",
    projectController.removeMemberFromProject
);

router.module.exports = router;
