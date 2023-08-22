import axios from "axios";
import youtubeSearchApi from "youtube-search-api";
import get from "../configs/env.config.js";
const YOUTUBE_API_URL = get('youtube_api_url');
const YOUTUBE_API_KEY = get('youtube_api_key');

export async function getYoutubeVideo(youtubeVideoId) {
    try {
        const response = await axios.get(`${YOUTUBE_API_URL}/videos?part=`);
        const {
            snippet: {
                title,
                thumbnails: { default: { url: thumbnailUrl } }
            },
            contentDetails: { duration }
        } = response.data.items[0];
        return {
            title,
            thumbnailUrl,
            duration: extractDurationFromYoutube(duration)
        };
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export function searchYoutube(keyword){
    try {
        
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}