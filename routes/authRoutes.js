const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/refresh", (req, res) => {
    res.json({ refresh: "refresh" });
});

router.post("/logout", (req, res) => {
    res.json({ logout: "logout" });
});

module.exports = router;
