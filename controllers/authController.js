const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

authController = {
    register: async (req, res, next) => {
        try {
            const { username, email, password } = req.body;

            const hash = await bcrypt.hash(password, 10);

            const newUser = new User({ username, email, password: hash });
            const doc = await User.findOne({ username, email });

            console.log(doc);
            if (doc) {
                return res
                    .status(404)
                    .json({ message: "User already registered!" });
            }

            await newUser.save();
            return res.status(200).json({ success: true, newUser });
        } catch (e) {
            next(e);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            console.log(req.body);
            const existedUser = await User.findOne({ email });

            console.log(existedUser);
            if (!existedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User is not registered",
                });
            }

            const isCorrect = await bcrypt.compare(
                password,
                existedUser.password
            );
            if (isCorrect) {
                return res
                    .status(200)
                    .json({ success: true, message: "logged in, user exists" });
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Incorrect Password",
                });
            }
        } catch (e) {
            next(e);
        }
    },
    refresh: (req, res, next) => {},
    logout: (req, res, next) => {},
};

module.exports = authController;
