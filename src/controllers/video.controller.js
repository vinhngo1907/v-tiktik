import { getVideoById, getAll as _getAll } from "../services/video.service.js";

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

export async function createVideo(){
    try {
        
    } catch (error) {
        next(error);
    }
}