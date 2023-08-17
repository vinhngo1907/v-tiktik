import { UserModel } from "../models/index.js";

export const createOrUpdateUser = async (nickname, email, picture) => {
    try {
        return await UserModel.findOneAndUpdate(
            {
                $or: [{ email }, { nickname }]
            }, { nickname, email, picture }, { new: true, upsert: true });
    } catch (error) {
        console.log(error.message);
    }
}