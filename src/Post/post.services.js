import { getDB } from "../config/mongodb.config.js";
import PostRepository from "./post.repository.js";
import PostModel from "./post.model.js";
import UserRepository from "../User/user.repository.js";
import { ObjectId } from "mongodb";
import { NotFoundError, ValidationError ,ForbiddenError} from "../error-handler/business.layer.error.js";

/**
 * Service layer for handling post-related operations.
 */
export default class PostService {
    constructor() {
        this.postRepository = new PostRepository();
        this.userRepository = new UserRepository();
        this.collection = getDB().collection('Post');
    }

    /**
     * Creates a new post by a user.
     * @param {Object} param0 - The post details.
     * @param {string} param0.userId - ID of the user creating the post.
     * @param {string} param0.caption - Caption for the post.
     * @param {string} param0.imageUrl - URL of the post image.
     * @param {string} param0.content - Full post content.
     * @returns {Promise<Object>} The created post document.
     * @throws {Error} Throws error if creation fails.
     */
    async createNewPost({ userId, caption, imageUrl, content }) {
        if(!ObjectId.isValid(userId)) throw new ValidationError("Incorrect userId.");

            const date = new Date().toString();
            const newPost = new PostModel(new ObjectId(userId), caption, imageUrl, content, date);
            const result = await this.postRepository.add(newPost);
            return result;

    }

    /**
     * Retrieves paginated posts. 4 posts per page.
     * @param {number} n - The page number (1-based index).
     * @returns {Promise<Object[]>} Array of post documents.
     * @throws {Error} Throws error if fetch fails.
     */
    async getAll(n) {
        try {
            const si = 4 * (n - 1); // starting index for 4 posts per page
            const posts = await this.postRepository.getAll();
            return posts.filter((p, i) => i >= si && i < si + 4);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves a single post by its ID.
     * @param {string} postId - The post's unique identifier.
     * @returns {Promise<Object|null>} The post document if found, else null.
     * @throws {Error} Throws error if retrieval fails.
     */
    async getByPostId(postId) {
        try {
            const post = await this.postRepository.getByPostId(postId);
            return post;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves all posts created by a specific user.
     * @param {string} userId - The user's unique identifier.
     * @returns {Promise<Object[]>} Array of post documents.
     * @throws {Error} Throws error if retrieval fails.
     */
    async getByUserId(userId) {
        try {
            const posts = await this.postRepository.getByUserId(userId);
            return posts;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Deletes a post only if it belongs to the requesting user.
     * @param {string} postId - ID of the post to delete.
     * @param {string} userId - ID of the user requesting deletion.
     * @returns {Promise<Object>} Deletion result.
     * @throws {ForbiddenError} If user does not own the post.
     * @throws {Error} Throws error if deletion fails.
     */
    async delete(postId, userId) {
        try {
            const postOwner = await this.postRepository.getByPostId(postId);
            if (postOwner.userId.toString() !== userId.toString())
                throw new ForbiddenError("You cannot delete this post");

            const result = await this.postRepository.delete(postId, userId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates a post's data.
     * @param {Object} post - The post object containing updated data.
     * @returns {Promise<Object>} Updated post document.
     * @throws {Error} Throws error if update fails.
     */
    async update(post) {
            const postOwner = await this.postRepository.getByPostId(post.postId);
            if (postOwner.userId.toString() !== post.userId.toString())
                throw new ForbiddenError("You cannot update this post")
            const result = await this.postRepository.update(post);
            if(!result) throw new NotFoundError("Post not found.")
            return { success: true, post: result };

    }
}