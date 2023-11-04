import { createOrUpdateUser } from '../services/user.service.js';
export async function userProfile(req, res, next) {
    try {
        const { email, nickname, picture } = req.oidc.user;
        const user = await createOrUpdateUser(email, nickname, picture);
        return res.status(200).json({
            id: user._id.toString(),
            nickname: user.nickname,
            picture: user.picture,
            email: user.email
        })
    } catch (error) {
        next(error);
        // return res.status(500).json({ message: error.message });
    }
}