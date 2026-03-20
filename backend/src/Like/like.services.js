import { ObjectId } from "mongodb";
import LikeRepository from "./like.repository.js";
import { NotFoundError, UnexpectedError, ValidationError } from "../error-handler/business.layer.error.js";
import LikeModel from "./like.model.js";
import PostRepository from "../Post/post.repository.js";
import CommentRepository from "../Comment/comment.repository.js";
import UserRepository from "../User/user.repository.js";
/**
 * This class is for handling the logic behind likes.
 * 
 * The controller calls this, and this talks to the repository.
 * Here we make sure the id is valid, check if it's a post or comment,
 * and then add or remove likes in the database.
 */
export default class LikeServices {
    constructor() {
        // repositories (database handlers)
        this.likeRepository = new LikeRepository();
        this.postRepository = new PostRepository();
        this.commentRepository = new CommentRepository();
        this.userRepository = new UserRepository();
    }

    /**
     * Get all likes for a given post or comment.
     * 
     * @param {string} id - postId or commentId or userId
     * @returns {Promise<object>} - success flag and likes data
     */
    async getLikes(id) {
    if (!ObjectId.isValid(id)) {
        throw new ValidationError("Invalid Id");
    }

    // 1.Check if ID belongs to a Post
    const post = await this.postRepository.getByPostId(id);
    if (post) {
        const likes = await this.likeRepository.getLikes(id);
        return { success: true, data: likes, type: "post" };
    }

    // 2.Check if ID belongs to a Comment
    const comment = await this.commentRepository.findById(id);
    if (comment) {
        const likes = await this.likeRepository.getLikes(id);
        return { success: true, data: likes, type: "comment" };
    }

    // 3.Check if ID belongs to a User (user profile likes)
    const user = await this.userRepository.getUser(id);
    if (user) {
        const likes = await this.likeRepository.getLikesByUserId(id);
        return { success: true, data: likes };
    }

    // ID belongs to nothing
    throw new NotFoundError("Nothing exists with this Id");
}
    /**
     * Add or remove like for a post or comment.
     * If user already liked, remove it.
     * If not, add it.
     * 
     * @param {string} id - postId or commentId
     * @param {string} userId - the user doing the action
     * @returns {Promise<object>} - success flag and message
     */
    async toggleLike(id, userId) {
        console.log("toggleLike is called,")
        let item = "post";

        // check if id is post or comment
        if (!await this.postRepository.getByPostId(id)) {
            if (!await this.commentRepository.findById(id)) {
                throw new ValidationError("Invalid Id");
            } else {
                item = "comment";
            }
        }

        // check if already liked
        const isLiked = await this.likeRepository.getLike(id, userId);
        if (isLiked) {
            // remove like
            const result = await this.likeRepository.remove(isLiked._id, item);

            if (!result || result.deletedCount <= 0) {
                throw new UnexpectedError("Failed to remove like.");
            }

            return { success: true, message: "Disliked successfully." };
        } else {
            // add like
            const like = new LikeModel(new ObjectId(id), new ObjectId(userId), item);
            await this.likeRepository.addLike(like, item);

            return { success: true, message: "Liked successfully." };
        }
    }
}