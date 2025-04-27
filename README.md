# Project Management Backend API

A robust, secure backend server for a Project Management Application built with Node.js, Express, MongoDB, and JWT Authentication.

## Features

-   **Authentication**: JWT with access and refresh tokens
-   **Projects Management**: Create, update, delete, and share projects
-   **Task Management**: Assign tasks to project members, track status, add comments
-   **API Security**: Rate limiting and secure token handling

## API Endpoints

## Authentication

-   Register - `POST /auth/register`

-   Login - `POST /auth/login`

-   Logout - `GET /auth/logout`

-   Refresh Token - `GET /auth/refresh`

Access tokens are short-lived, and refresh tokens are stored securely in cookies.

### Projects

-   Create Project - `POST /projects/createProject`

-   Get User's Projects - `GET /projects/getUserProjects`

-   Get Single Project - `GET /projects/getSingleProject`

-   Delete Project - `DELETE /projects/deleteProject`

-   Update Project - `PUT /projects/updateProject`

-   Tasks Under a Project - `GET /projects/getProjectTasks`

-   Create Task Under Project - `POST /projects/createTaskUnderProject`

-   Update Project Members - `GET /projects/updateProjectMembers`

-   Update Task Assignees - `GET /projects/updateTaskAssignees`

### Tasks

-   Create Standalone Task (not under a project) - `POST /tasks/createStandaloneTask`

-   Get User's Tasks - `GET /tasks/getUserTasks`

-   Update Task - `PUT /tasks/updateTask`

-   Delete Task - `DELETE /tasks/deleteTask`

-   Create Comment Under Task - `POST /tasks/createCommentUnderTask`

-   Get Task Comments - `GET /tasks/getTaskComments`

### Comments

-   Update Comment - `PUT /comments/updateComment`

-   Delete Comment - `DELETE /comments/deleteComment`

## Technologies Used

-   Node.js

-   Express.js

-   MongoDB with Mongoose ODM

-   JWT Authentication (Access Token + Refresh Token stored in HTTP-Only Cookies)

-   Express Rate Limit for API protection

-   Bcrypt for password hashing
