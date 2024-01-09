const mongoose = require("mongoose")

const DB = process.env.DATABASE_URL;

mongoose.connect(DB)
    .then(() => {
        console.log("DB connection established");
    }).catch((err) => {
        console.log(`Unable to connect DB.\n${err}`)
    });