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
        const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (!user) {
            return next(
                new ApiError(300, "Invalid Access Token or Token Expired!")
            );
        }

        req.user = user;
        next();
    } catch (e) {
        console.log("err at verifying access token: ", e);
        next(e);
    }
};
