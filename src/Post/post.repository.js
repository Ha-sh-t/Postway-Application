import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.config.js";
import { comments } from "../Comment/comment.model.js";

/**
 * Repository class to handle all database operations related to Posts.
 */
class PostRepository {
    constructor() {
        /**
         * @type {import("mongodb").Collection}
         */
        this.collection = getDB().collection('Posts');
    }

    /**
     * Adds a new post to the database.
     * @param {Object} post - The post object to add.
     * @returns {Promise<import("mongodb").InsertOneResult>} - The result of the insertion.
     * @throws Will throw an error if insertion fails.
     */
    async add(post) {
        const res = await this.collection.insertOne(post);
        console.log("added post:", res);
        return res;
    }

    /**
     * Retrieves all posts, sorted in descending order by date.
     * @returns {Promise<Array>} - Array of post objects.
     * @throws Will throw an error if retrieval fails.
     */
    async getAll() {
        try {
            const posts = await this.collection.find().sort({ date: -1 }).toArray();
            console.log("posts:", posts);
            return posts;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a single post by its ID.
     * @param {string} postId - The ID of the post to retrieve.
     * @returns {Promise<Object|null>} - The found post or null if not found.

     */
    async getByPostId(postId) {
        return await this.collection.findOne({ _id: new ObjectId(postId) });
    }

    /**
     * Retrieves all posts created by a specific user.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<Array>} - Array of post objects.
     * @throws Will throw an error if retrieval fails.
     */
    async getByUserId(userId) {
        try {
            const posts = await this.collection.find({ userId: new ObjectId(userId) }).toArray();
            return posts;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates a post with new values for caption and/or imageUrl.
     * Handles conditional logic for unset, retain, or null cases.
     * @param {Object} post - The post data to update.
     * @param {string} post.postId - ID of the post.
     * @param {string} post.userId - ID of the user.
     * @param {string} [post.caption] - New caption (optional).
     * @param {string|null} [post.imageUrl] - New image URL or null to remove.
     * @returns {Promise<import("mongodb").Document|null>} - Updated post document.
     * @throws Will throw an error if update fails.
     */
    async update(post) {

        const res = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(post.postId), userId: new ObjectId(post.userId) },
            [
                {
                    $set: {
                        caption: post.caption === undefined
                            ? '$caption'
                            : (post.caption === null || post.caption === '' ? "Untitled post" : post.caption),
                        imageUrl: post.imageUrl === undefined
                            ? '$imageUrl'
                            : (post.imageUrl === null ? '$$REMOVE' : post.imageUrl),
                        editedAt: new Date(),
                    }
                }
            ],
            { returnDocument: 'after' }
        );
        return res;

    }

    /**
     * Deletes a post by its ID and user ID (for ownership check).
     * @param {string} postId - The ID of the post to delete.
     * @param {string} userId - The ID of the user requesting the deletion.
     * @returns {Promise<number>} - Number of documents deleted (0 or 1).
     * @throws Will throw an error if deletion fails.
     */
    async delete(postId, userId) {
        try {
            const res = await this.collection.deleteOne({
                _id: new ObjectId(postId),
                userId: new ObjectId(userId)
            });
            return res.deletedCount;
        } catch (error) {
            throw error;
        }
    }

    static async updateCommentCount(postId, count) {
        const collection = getDB().collection('Posts');
        try {
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(postId) },
                { $set: { comments: count } }
            );
            return result;
        } catch (err) {
            console.error("Error updating comment count:", err);
            throw err;
        }
    }
        static async updateLikesCount(postId, count) {
        const collection = getDB().collection('Posts');
        try {
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(postId) },
                { $set: { likes: count } }
            );
            return result;
        } catch (err) {
            console.error("Error updating like count:", err);
            throw err;
        }
    }

}

export default PostRepository;