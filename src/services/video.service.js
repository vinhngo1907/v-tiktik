import VideoModel from '../models/video.model.js';
import Queue from "../utils/queue.util.js";
import io from "../../index.js";

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

export function getAll(){
    try {
        return songsForQueue;
    } catch (error) {
        throw error;
    }
}

export async function createVideo(youtubeVideoId, authorEmail){
    try {
        
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}