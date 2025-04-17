const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

module.exports = {
    validateUsers: async (userIds) => {
        for (const userId of userIds) {
            let userExists = await User.exists({ _id: userId });
            if (!userExists) {
                throw new ApiError(
                    404,
                    `User with ID: ${userId} does not exist!`
                );
            }
        }

        return true;
    },
};
