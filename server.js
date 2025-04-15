require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app.js");

const port = 3000 || process.env.PORT;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongo Db Connected!");

        app.listen(port, () => {
            console.log("Server is listenig on port " + 3000);
        });
    })
    .catch((err) => {
        console.log("Mongo Db connection error!\n" + err);
    });
