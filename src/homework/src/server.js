// Express boilerplate, hosting the `dist` file, connecting to the routes
const express = require("express");
const itemRouter = require("./server/routes/api.js");
const { errorHandler } = require("./server/middleware/errorHandler.js");
const morgan = require("morgan");
const cors = require("cors");
const port = 8888;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("common"));

// app.use(express.static("dist"));

app.use("/item", itemRouter);
app.use(errorHandler);
process.on("unhandledRejection", (reason, promise) => {
	throw reason;
});

process.on("uncaughtException", error => {
	process.exit(1);
});

let msg = ` listening at port ${port}`;

app.listen(port, () => {
});
