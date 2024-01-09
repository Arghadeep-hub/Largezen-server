const cors = require("cors");
const express = require("express");
require("dotenv").config();

const user_router = require("./routes/user_route");
const lead_router = require("./routes/lead_route");
const { logReqRes } = require("./middlewares");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Database Connection
require("./connection");

// Middlewares
app.use(express.json());
app.use(cors());
app.use(logReqRes("log.txt")); // Generating Logs

// Routes
app.use("/user", user_router);
app.use("/lead", lead_router);

// Error Handler
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Started on http://localhost:${process.env.PORT}`)
);
