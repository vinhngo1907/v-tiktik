import VideoModel from '../models/video.model.js';
import UserModel from '../models/user.model.js';
import Queue from "../utils/queue.util.js";
import io from "../../index.js";
import { getYoutubeVideo } from './youtube.service.js';

const videoQueue = new Queue();
let seniorSongs = [];
let juniorSongs = [];
let otherSongs = [];
let songsForQueue = [];
let playingVideo = null;
let currentVideoStartedTime = null;

export async function getVideoById(id) {
    try {
        return await VideoModel.findById(id);
    } catch (error) {
        throw error;
    }
}

export function getAll() {
    try {
        return songsForQueue;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function createVideo(youtubeVideoId, authorEmail) {
    try {
        const { title, thumbnailUrl, duration } = await getYoutubeVideo(youtubeVideoId);
        const user = await UserModel.findOne({ email: authorEmail });
        const newVideo = await VideoModel.create({
            title, youtubeVideoId, user, duration, thumbnailUrl,
            user: {
                _id: user._id,
                nickname: user.nickname
            }
        });

        otherSongs.push({
            ...newVideo._doc,
            user: {
                _id: user._id,
                nickname: user.nickname
            }
        });

        io.emit("other-tracks-update", otherSongs);
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

export async function deleteVideo(id) {
    try {
        videoQueue.deleteVideo(id);
        io.emit("new-video-add", {});
        return await VideoModel.findByIdAndDelete(id);
    } catch (error) {

    }
}