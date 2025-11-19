/**
 * @module comment.controller.js
 * @description Controller class for handling comment-related HTTP requests and responses.
 *              Interacts with the service layer to perform CRUD operations on comments.
 * 
 * @requires ../error-handler/applicationError.js
 * @requires ./comment.services.js
 */

import { ApplicationError } from "../error-handler/applicationError.js";
import CommentServices from "./comment.services.js";

/**
 * Controller for comment operations.
 */
class CommentController {
    constructor() {
        /** @private */
        this.commentServices = new CommentServices();
    }

    /**
     * Retrieve all comments for a given post.
     * @async
     * @function getComments
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Promise<void>}
     */
    async getComments(req, res, next) {
        try {
            const { postId } = req.params;
            const response = await this.commentServices.getCommentsByPostId(postId);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Add a new comment to a post.
     * @async
     * @function addComment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Promise<void>}
     */
    async addComment(req, res, next) {
        try {
            const userId = req.session.user._id;
            const { content } = req.body;
            const { postId } = req.params;

            const response = await this.commentServices.addComment({ userId, postId, content });
            res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete an existing comment.
     * @async
     * @function deleteComment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Promise<void>}
     */
    async deleteComment(req, res, next) {
        try {
            const userId = req.session.user._id;
            const { commentId } = req.params;

            const response = await this.commentServices.deleteComment({ commentId, userId });

            res.json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update an existing comment.
     * @async
     * @function updateComment
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {Promise<void>}
     */
    async updateComment(req, res, next) {
        try {
            const { commentId } = req.params;
            const { content } = req.body;
            const userId = req.session.user._id;

            const response = await this.commentServices.updateComment({ commentId, userId, content });
            res.json(response);
        } catch (err) {
            next(err);
        }
    }
}

export default CommentController;