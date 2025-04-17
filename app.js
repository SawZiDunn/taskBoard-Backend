const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
// csrf attack prevent
// express-validator

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6:
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: {
        success: false,
        message: "Too many login attempts, please try again later",
    },
});

// Apply rate limiting middleware to all requests.
app.use(limiter);

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // tp pass cookies

app.use("/api/auth", authRoutes);

// proteted routes
app.use("/api/tasks", auth, taskRoutes);
app.use("/api/projects", auth, projectRoutes);
app.use(".api/comments", auth, commentRoutes);

app.use(errorHandler);

module.exports = app;
