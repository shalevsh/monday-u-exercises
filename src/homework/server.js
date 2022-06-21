// Express boilerplate, hosting the `dist` file, connecting to the routes
import express from 'express';
import itemRouter from './server/routes/api.js';
import errorHandler from './server//middleware/errorHandler.js';
import cors from 'cors'
const  port = 8080;
const app = express();



app.use([cors(),express.json()]);
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