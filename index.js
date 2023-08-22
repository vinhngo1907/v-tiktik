import express from "express";
import cors from "cors";
import get from "./src/configs/env.config.js";
import { connectDB } from "./src/configs/db.config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleError, handleNotFoundPage } from "./src/middlewares/error.middlware.js";
import morgan from 'morgan';
import userRoute from "./src/routes/user.route.js";
import videoRoutes from "./src/routes/video.route.js";
import oidc from 'express-openid-connect';
import * as fs from 'fs';
const auth = oidc.auth;
import moment from "moment";

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
io.on("connection", () => {
    const tracks = getTrac
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(auth(config));
app.use(express.static("./public"));

// connect DB
connectDB();

app.get('/', (req, res) => {
    logger.info('GET /');
    res.send('App works!!!!!');
});

// Config routes
app.use('/video', videoRoutes());
app.use('/user', userRoute());

app.get("/login", (req, res) => {
    res.oidc.login();
});
app.get("/logout", (req, res) => {
    req.oidc.logout();
});

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