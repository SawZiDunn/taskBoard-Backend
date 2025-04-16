const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
require("dotenv").config();

module.exports = (req, res, next) => {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
        // return to exist early, further processes stopped
        return next(new ApiError(300, "No Token Provided"));
    }

    const token = req.headers["authorization"].split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;
        next();
    } catch (e) {
        next(e);
    }
};
