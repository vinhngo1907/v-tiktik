import express from "express";
import openId from "express-openid-connect";
import { getById } from "../controllers/index.js";


const Router = express.Router;
const router = Router();


export default () => {
    // router.route("/").post()
    router.get("/:id", getById);

    return router;
}