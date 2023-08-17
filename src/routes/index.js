import express from "express";

import userRoutes from "./user.route.js";

const apiRouter = express();

apiRouter.use('/user', userRoutes);

export default apiRouter;