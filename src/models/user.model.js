import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    nickname: { type: String, required: true, unique: true },
    picture: { type: String, required: true }
}, {
    versionKey: false, timestamps: true
});

const User = mongoose.model("Users", UserSchema);

export default User;