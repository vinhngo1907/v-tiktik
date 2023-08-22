// This file just can be tested by integration tests
/* istanbul ignore file */
import express from "express";
import openId from "express-openid-connect";
import { userProfile } from "../controllers/user.controller.js"

const Router = express.Router;
const router = Router();

export default () => {
    router.get('/me', openId.requiresAuth(), userProfile);
    return router;
};