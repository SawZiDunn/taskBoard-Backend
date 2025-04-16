const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

authController = {
    register: async (req, res, next) => {
        try {
            const { username, email, password } = req.body;

            // improve with express-validator or Joi
            if (!username || !email || !password) {
                return res
                    .status(400)
                    .json({ message: "All fields are required!" });
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                next(new ApiError(409, "Email already registered!"));
            }

            const hash = await bcrypt.hash(password, 10);

            const newUser = new User({ username, email, password: hash });

            await newUser.save();
            return res.status(201).json({
                success: true,
                message: "New User registered successfully.",
                user: { username: newUser.username, email: newUser.email },
            });
        } catch (e) {
            console.log("Registratin Error:\n", err);
            next(e);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Email and Password are required!" });
            }

            const existedUser = await User.findOne({ email });

            if (!existedUser) {
                return res.status(404).json({
                    message: "User is not registered",
                });
            }

            const isCorrect = await bcrypt.compare(
                password,
                existedUser.password
            );
            if (!isCorrect) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Password.",
                });
            }

            const token = jwt.sign(
                {
                    id: existedUser._id,
                    username: existedUser.username,
                    email: existedUser.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
            );
            return res.status(200).json({
                success: true,

                message: "Login Successful",
                token,
                user: {
                    username: existedUser.username,
                    email: existedUser.email,
                },
            });
        } catch (e) {
            console.error("Login error:", err);
            next(e);
        }
    },

    refresh: (req, res, next) => {},
    logout: (req, res, next) => {
        delete req.user;
        next();
    },
};

module.exports = authController;
