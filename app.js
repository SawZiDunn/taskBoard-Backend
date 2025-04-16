const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// proteted routes
app.use("/api/tasks", auth, taskRoutes);
app.use("/api/projects", auth, projectRoutes);

app.use(errorHandler);

module.exports = app;
