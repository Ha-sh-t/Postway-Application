/**
 * @module comment.services.js
 * @description Service layer for comment operations.
 *              Handles business logic and interacts with repositories.
 * 
 * @requires mongodb.ObjectId
 * @requires ./comment.model.js
 * @requires ./comment.repository.js
 * @requires ../error-handler/business.layer.error.js
 * @requires ../Post/post.repository.js
 * @requires ../User/user.repository.js
 */

import { ObjectId } from "mongodb";
import CommentModel from "./comment.model.js";
import CommentRepository from "./comment.repository.js";
import { ForbiddenError, NotFoundError, UnexpectedError, ValidationError } from "../error-handler/business.layer.error.js";
import PostRepository from "../Post/post.repository.js";
import UserRepository from "../User/user.repository.js";

/**
 * Service class for handling comment-related business logic.
 */
class CommentServices {

    constructor() {
        /** @private */
        this.commentRepository = new CommentRepository();
        this.postRepository = new PostRepository();
        this.userRepository = new UserRepository();
    }

    /**
     * Get all comments for a given post.
     * @async
     * @param {string} postId - The ID of the post.
     * @throws {ValidationError} If postId is invalid.
     * @throws {NotFoundError} If post does not exist.
     * @returns {Promise<Array>} List of comments.
     */
    async getCommentsByPostId(postId) {
        if (!ObjectId.isValid(postId)) throw new ValidationError("Invalid postId");

        const post = await this.postRepository.getByPostId(postId);
        if (!post) throw new NotFoundError('Post not found');

        const comments =  await this.commentRepository.get(postId);
        return { success: true, data: comments }
    }

    /**
     * Add a new comment to a post.
     * @async
     * @param {Object} params
     * @param {string} params.userId - ID of the user adding the comment.
     * @param {string} params.postId - ID of the post to comment on.
     * @param {string} params.content - Content of the comment.
     * @throws {NotFoundError} If post does not exist.
     * @returns {Promise<Object>} Created comment.
     */
    async addComment({ userId, postId, content }){
        if (!ObjectId.isValid(postId)) throw new ValidationError("Invalid userId");
        const post = await this.postRepository.getByPostId(postId);
        if (!post) throw new NotFoundError('Post not found');

        const date = new Date();
        const newComment = new CommentModel(new ObjectId(userId), new ObjectId(postId), content, date);
        const addedComment =  await this.commentRepository.add(newComment);
        return { success: true, data: addedComment}
    }

    /**
     * Delete a comment.
     * @async
     * @param {Object} params
     * @param {string} params.commentId - ID of the comment to delete.
     * @param {string} params.userId - ID of the requesting user.
     * @throws {ValidationError} If commentId is invalid.
     * @throws {NotFoundError} If comment does not exist.
     * @throws {ForbiddenError} If user is not allowed to delete the comment.
     * @returns {Promise<number>} Result of deletion operation.
     */
    async deleteComment({ commentId, userId }) {
        if (!ObjectId.isValid(userId)) throw new ValidationError("Invalid userId");
        if (!ObjectId.isValid(commentId)) throw new ValidationError("Invalid commentId");

        const comment = await this.commentRepository.findById(commentId);
        if (!comment) throw new NotFoundError('Comment not found');

        const post = await this.postRepository.getByPostId(comment.postId);
        if (comment.userId.toString() !== userId.toString() && post.userId.toString() !== userId.toString()) {
            throw new ForbiddenError('You cannot delete this comment');
        }

        if(await this.commentRepository.delete(commentId, comment.postId)){
            return {success:true , data:"Comment is deleted successfully!"}
        }
        throw new UnexpectedError("Unable to delete comment please try again !")
    }

    /**
     * Update an existing comment.
     * @async
     * @param {Object} params
     * @param {string} params.commentId - ID of the comment to update.
     * @param {string} params.userId - ID of the requesting user.
     * @param {string} params.content - Updated comment content.
     * @throws {ValidationError} If commentId is invalid.
     * @throws {NotFoundError} If comment does not exist.
     * @throws {ForbiddenError} If user is not allowed to update the comment.
     * @returns {Promise<Object>} Updated comment.
     */
    async updateComment({ commentId, userId, content }) {
        if (!ObjectId.isValid(commentId)) throw new ValidationError("Invalid commentId");

        const comment = await this.commentRepository.findById(commentId);
        if (!comment) throw new NotFoundError('Comment not found');

        const post = await this.postRepository.getByPostId(comment.postId);
        if (comment.userId.toString() !== userId.toString() && post.userId.toString() !== userId.toString()) {
            throw new ForbiddenError('You cannot update this comment');
        }

        const result = await this.commentRepository.update(commentId, userId, content);
        if(!result) throw new UnexpectedError("Unable to update comment. please try later");
        return { success: true, data: result }
    }
}

export default CommentServices;