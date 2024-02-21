const mongoose = require("mongoose")
const { Reset, FgBlue, FgRed } = require("./colors");

const DB = process.env.DATABASE_URL;

mongoose.connect(DB)
    .then(() => {
        console.log(`${FgBlue}%s${Reset}`, "DB connection established");
    }).catch((err) => {
        console.log(`${FgRed}%s${Reset}`, `Unable to connect DB.\n${err}`)
    });