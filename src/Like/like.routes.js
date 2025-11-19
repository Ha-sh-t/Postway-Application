import express from 'express';
import LikeController from './like.controller.js';

const likeRouter = express.Router();
const likeController = new LikeController();

/**
 * @route POST /toggle/:id
 * @description Toggle like/unlike for a specific entity (e.g., post, comment, etc.)
 * @param {string} req.params.id - The ID of the entity to like/unlike
 * @returns {object} 200 - Success response with updated like status
 * @returns {Error}  400 - Invalid request or missing params
 */
likeRouter.post('/toggle/:id', (req, res, next) => {
    likeController.toggleLike(req, res, next);
});

/**
 * @route GET /:id
 * @description Get total likes for a specific entity
 * @param {string} req.params.id - The ID of the entity
 * @returns {object} 200 - Success response with like count
 * @returns {Error}  404 - Entity not found
 */
likeRouter.get('/:id', (req, res, next) => {
    likeController.getLikes(req, res, next);
});

export default likeRouter;