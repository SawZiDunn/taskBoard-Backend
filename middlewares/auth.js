const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
require("dotenv").config();

module.exports = (req, res, next) => {
    if (!req.authorization.startsWith("Bearer ")) {
        next(new ApiError(300, "User is not logged in."));
    }

    const token = req.authorization.split(" ")[1];

    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user });
};
