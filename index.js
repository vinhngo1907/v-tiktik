import express from "express";
import cors from "cors";
import get from "./src/configs/env.config.js";
import { connectDB } from "./src/configs/db.config.js";
import moment from "moment";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleError, handleNotFoundPage } from "./src/middlewares/error.middlware.js";
import morgan from 'morgan';
import { join } from 'path';
import userRoute from "./src/routes/user.route.js";
import rfs from 'rotating-file-stream';

const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: get('base_url'),
    clientID: get('client_id'),
    issuerBaseURL: get('auth0_domain'),
    secret: get('secret'),
}

// configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// create a rotating write stream
// const accessLogStream = rfs('access.log', {
//     interval: '1d', // rotate daily
//     path: join(__dirname, 'log'),
// });

// adding morgan to log HTTP requests
// app.use(isProduction ? morgan('combined', { stream: accessLogStream }) : morgan('dev'));

// connect DB
connectDB();

app.get('/', (req, res) => {
    logger.info('GET /');
    res.send('App works!!!!!');
});

app.use('/user', userRoute());

// request to handle undefined or all other routes
app.get('*', (req, res) => {
    // logger.info('GET undefined routes');
    res.send('App works!!!!!');
});

// handler error
app.use(handleNotFoundPage);
app.use(handleError);

// Error handlers & middlewares
if (!isProduction) {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

// start app
const port = get('port');

httpServer.listen(port, () => console.log(`Server start at port ${port}`));

export default io;