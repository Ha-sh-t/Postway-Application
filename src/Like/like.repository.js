import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.config.js";
import PostRepository from "../Post/post.repository.js";
import CommentRepository from "../Comment/comment.repository.js";

/**
 * Repository class for managing Like operations in MongoDB.
 */
class LikeRepository {

    constructor() {
        /** @type {import("mongodb").Collection} */
        this.collection = getDB().collection('Likes');
    }

    /**
     * Get total like count for a given item.
     * @param {string} id - The item ID (post or comment).
     * @returns {Promise<number>} Number of likes.
     */
    async getLikesCount(id) {
        return await this.collection.countDocuments({ itemId: new ObjectId(id) });
    }

    /**
     * Add a like and update the like count in Post/Comment collection.
     * @param {Object} like - Like object containing userId, itemId, etc.
     * @param {"post"|"comment"} item - Type of item being liked.
     * @returns {Promise<Object>} Inserted like object with ID.
     */
    async addLike(like, item) {
        const { insertedId } = await this.collection.insertOne(like);
        const count = await this.getLikesCount(like.itemId);
        console.log("count:", count);

        if (item === "post") {
            PostRepository.updateLikesCount(like.itemId, count);
        } else {
            CommentRepository.updateLikesCount(like.itemId, count);
        }
        return { ...like, insertedId };
    }

    /**
     * Remove a like and update the like count in Post/Comment collection.
     * @param {string} id - The like document ID.
     * @param {"post"|"comment"} item - Type of item being unliked.
     * @returns {Promise<number>} Number of documents deleted (0 or 1).
     */
    async remove(id, item) {
        const { deletedCount } = await this.collection.deleteOne({ _id: new ObjectId(id) });
        const count = await this.getLikesCount(id);

        if (item === "post") {
            PostRepository.updateLikesCount(id, count);
        } else {
            CommentRepository.updateLikesCount(id, count);
        }
        return deletedCount;
    }

    /**
     * Find if a user has liked a specific item.
     * @param {string} id - Item ID (post or comment).
     * @param {string} userId - User ID.
     * @returns {Promise<Object|null>} Like document or null.
     */
    async getLike(id, userId) {
        return await this.collection.findOne({
            itemId: new ObjectId(id),
            userId: new ObjectId(userId)
        });
    }

    /**
     * Get all likes for a specific item.
     * @param {string} id - Item ID (post or comment).
     * @returns {Promise<Object[]>} Array of like documents.
     */
    async getLikes(id) {
        const likes = await this.collection.find({ itemId: new ObjectId(id) }).toArray();
        console.log(likes);
        return likes;
    }
}

export default LikeRepository;