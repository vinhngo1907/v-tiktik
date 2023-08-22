import express from "express";
import openId from "express-openid-connect";
import { createVideo, getAll, getById, deleteVideo } from '../controllers/video.controller.js';


const Router = express.Router;
const router = Router();


export default () => {
    router.route("/").post(createVideo).get(getAll)
    router.get("/:id", getById);
    router.delete("/:id", openId.requiresAuth(), deleteVideo);
    return router;
}