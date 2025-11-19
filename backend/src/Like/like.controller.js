import LikeServices from "./like.services.js";

/**
 * Controller class for handling Like API requests.
 */
class LikeController {
    constructor() {
        /** @type {LikeServices} */
        this.likeServices = new LikeServices();
    }

    /**
     * Get all likes for a given item (post or comment).
     * Route: GET /likes/:id
     *
     * @param {import("express").Request} req - Express request object (expects `id` in params).
     * @param {import("express").Response} res - Express response object.
     * @param {import("express").NextFunction} next - Express next middleware function.
     */
    async getLikes(req, res, next) {
        try {
            const { id } = req.params; // extracting postId or commentId from URL params
            const response = await this.likeServices.getLikes(id);
            res.send(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Toggle like/unlike for a given item (post or comment) by the current user.
     * Route: POST /likes/toggle/:id
     *
     * @param {import("express").Request} req - Express request object (expects `id` in params and `user` in session).
     * @param {import("express").Response} res - Express response object.
     * @param {import("express").NextFunction} next - Express next middleware function.
     */
    async toggleLike(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.session.user._id; // current logged-in user
            const response = await this.likeServices.toggleLike(id, userId);

            res.json(response);
        } catch (err) {
            next(err);
        }
    }
}

export default LikeController;