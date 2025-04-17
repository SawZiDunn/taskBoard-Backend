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
            console.log("Registratin Error:\n", e);
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

            // generate accessToken
            const accessToken = jwt.sign(
                {
                    id: existedUser._id,
                    username: existedUser.username,
                    email: existedUser.email,
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
            );

            // generateRefreshToken
            const refreshToken = jwt.sign(
                {
                    id: existedUser._id,
                    username: existedUser.username,
                    email: existedUser.email,
                },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
            );

            // refreshToken in cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true, // only send over https
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // add refreshToken to User Model
            await User.findByIdAndUpdate(existedUser._id, {
                $set: {
                    refreshToken,
                },
            });

            return res.status(200).json({
                success: true,

                message: "Login Successful",
                accessToken,
                user: {
                    username: existedUser.username,
                    email: existedUser.email,
                },
            });
        } catch (e) {
            console.error("Login error:", e);
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return next(new ApiError(401, "No Refresh Token!"));
            }

            const payload = await jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

            const user = await User.findById(payload.id, { refreshToken: 1 }); // only retrieve refreshToken

            if (!payload) {
                return next(new ApiError(401, "Invalid Refresh Token!"));
            }

            if (user.refreshToken !== refreshToken) {
                return next(new ApiError(401, "Token is not stored in DB"));
            }

            const accessToken = jwt.sign(
                {
                    id: payload.id,
                    username: payload.username,
                    email: payload.email,
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
            );

            res.status(200).json({
                success: true,

                message: "Access Token regenerated",
                accessToken,
            });
        } catch (e) {
            console.log("refresh token err", e);
            next(e);
        }
    },
    logout: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return next(new ApiError(400, "No refreshToken found!"));
            }

            const decoded = await jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

            // delete refreshToken from DB
            const updatedUser = await User.findByIdAndUpdate(
                decoded.id,
                {
                    $set: {
                        refreshToken: null,
                    },
                },
                { new: true }
            );

            if (!updatedUser) {
                return next(new ApiError(400, "User Not Found"));
            }

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true, // process.env.NODE_ENV === "production"
                sameSite: "Strict",
            });

            return res.status(200).json({
                success: true,
                message: "Logout Successful!",
                updatedUser,
            });
        } catch (e) {
            console.log("err logging out: ", e);
            next(e);
        }
    },
};

module.exports = authController;
