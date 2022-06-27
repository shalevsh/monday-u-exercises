// Express boilerplate, hosting the `dist` file, connecting to the routes
const express = require('express');
const itemRouter = require( './server/routes/api.js');
const {errorHandler} = require( './server//middleware/errorHandler.js');
const morgan = require("morgan");
const cors = require('cors')
const  port = 8080;
const app = express();



app.use([morgan("common"),cors(),express.json()]);
app.use(express.static( 'dist'));
app.use('/item', itemRouter);
app.use(errorHandler);
process.on('unhandledRejection', (reason, promise) => {
    console.log("Unhandled Rejection", reason.message);
    throw reason
});

process.on('uncaughtException', (error) => {
    console.log("Uncaught Exception", error.message);
    process.exit(1);
});



let msg = ` listening at port ${port}`

app.listen(port, () => { console.log( msg ) ; })