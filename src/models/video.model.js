import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    title: { type: String, required: true },
    youtubeVideoId: { type: String, required: true, unique: true },
    thumnailUrl: { type: String, required: true },
    user: { type: String, ref: "User", required: true },
    duration: { type: Number, required: true },
    views: { type: Number, required: true, default: 0, min: 0 },
    likes: [],
    dislikes: [],
}, {
    timestamps: true, versionKey: false
});

const Video = mongoose.model("Videos", VideoSchema);

export default Video;