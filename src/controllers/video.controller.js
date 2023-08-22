import {
    getVideoById, getAll as _getAll,
    createVideo as _createVideo

} from "../services/video.service.js";

export async function getById(req, res, next) {
    try {
        const id = req.params.id;
        const video = await getVideoById(id);
        return req.json(video);
    } catch (error) {
        next(error);
    }
}

export async function getAll(req, res, next) {
    try {
        const videos = _getAll();
        return res.json(videos);
    } catch (error) {
        next(error);
    }
}

export async function createVideo(req, res, next) {
    try {
        const video = await _createVideo(req.body.yotubeVideoId, req.oidc.user.email);
        return res.json(video);
    } catch (error) {
        next(error);
    }
}