import express from "express";
import cors from "cors";
import get from "./src/configs/env.config.js";
import { connectDB } from "./src/configs/db.config.js";
import moment from "moment";
import { createServer } from "http";
import { Server } from "socket.io";

const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: get('base_url'),
    clientID: get('client_id'),
    issuerBaseURL: get('auth0_domain'),
    secret: get('secret'),
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// connect DB
connectDB();

// start app
const port = get('port');

httpServer.listen(port, () => console.log(`Server start at port ${port}`));

export default io;