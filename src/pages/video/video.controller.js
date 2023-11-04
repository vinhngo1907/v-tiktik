import {
    getVideoById, getAll as _getAll,
    createVideo as _createVideo,
    deleteVideo as _deleteVideo,
} from "../services/video.service.js";
import { searchYoutube as _searchYoutube } from '../services/youtube.service.js';

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
        const videos = await _getAll();
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

export async function deleteVideo(req, res, next) {
    try {
        const { email } = req.odic.user;
        if (email !== "vinhtrungngo@yahoo.com" && email !== "vinhngotrung1999@outlook.com.vn") {
            return res.status(401).end();
        }

        const videoId = req.params.id;
        return await _deleteVideo(videoId);
    } catch (error) {
        next(error);
    }
}

export async function searchYoutube(req, res, next) {
    try {
        const keyword = req.query.keyword;
        if (!keyword) return res.json([]);
        const videos = await _searchYoutube(keyword);
        return res.json(videos);
    } catch (error) {
        next(error);
    }
}