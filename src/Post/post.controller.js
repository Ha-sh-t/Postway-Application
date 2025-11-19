import { ApplicationError } from "../error-handler/applicationError.js";
import PostModel from "./post.model.js";
import PostService from "./post.services.js";

/**
 * Controller class to manage post-related operations.
 */
export default class PostController {
    constructor() {
        this.postServices = new PostService();
    }

    /**
     * Create a new post.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware.
     */
    async createNewPost(req, res, next) {
        try {
            const { caption, content } = req.body;
            const userId = req.session.user._id;
            console.log(userId)
            const imageUrl = '/media/posts/' + req.file.filename;

            const response = await this.postServices.createNewPost({ userId, caption, imageUrl, content });

            if (response.acknowledged) {
                return res.status(201).json({ success: true, message: "New post posted successfully." });
            }

            throw new ApplicationError("Error in Creating Post", 500);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Retrieve all posts with pagination.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async getAll(req, res, next) {
        try {
            const n = req.query.page;
            const posts = await this.postServices.getAll(n);
            res.status(200).json({ success: true, posts });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get a single post by its ID.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async getPostByPostId(req, res, next) {
        try {
            const { postId } = req.params;
            const post = await this.postServices.getByPostId(postId);
            if (post) {
                return res.status(200).json({ success: true, post });
            }
            throw new ApplicationError("Post not found.", 404);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get all posts created by a specific user.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async getPostsByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const userPosts = await this.postServices.getByUserId(userId);
            if (!userPosts || userPosts.length === 0) {
                throw new ApplicationError("No post yet.", 404);
            }
            res.status(200).json({ success: true, posts: userPosts });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete a post by ID if it belongs to the current user.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async deletePost(req, res, next) {
        try {
            const { postId } = req.params;
            const userId = req.session.user._id;
            const response = await this.postServices.delete(postId, userId);

            if (response) {
                return res.status(200).json({ success: true, message: "Post deleted successfully." });
            }

            throw new ApplicationError("Nothing to delete.", 204);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Update a post's caption and image.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async updatePost(req, res, next) {
        try {
            const { postId } = req.params;
            const { caption ,content } = req.body;
            const postUrl = '../../uploads/posts/' + req.file.filename;
            const userId = req.session.user._id;

            const response = await this.postServices.update({ postId, userId, caption, content, postUrl });

            
                return res.json(response);
            
        } catch (err) {
            next(err);
        }
    }

    /**
     * Filter posts by caption.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    filterPost(req, res, next) {
        try {
            const { caption } = req.query;
            const response = PostModel.filter(caption);
            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Save a post draft.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    saveToDraft(req, res, next) {
        try {
            const { caption } = req.body || {};
            const { draftId } = req.params || {};
            const imageUrl = req.file?.filename ? '/media/posts/' + req.file.filename : null;
            const userId = req.cookies.userId;

            const response = PostModel.draft(caption, imageUrl, userId.email, draftId);
            res.status(response.status).json(response.res);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Fetch a draft by its ID.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    fetchFromDraft(req, res, next) {
        try {
            const { draftId } = req.params;
            const userId = req.cookies.userId;

            const response = PostModel.fetchDraft(userId.email, draftId);
            res.status(response.status).json(response.res);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete a post draft.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    deleteFromDraft(req, res, next) {
        try {
            const { draftId } = req.params;
            const userId = req.cookies.userId;

            const response = PostModel.deleteDraft(userId.email, draftId);
            res.status(response.status).json(response.res);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get all drafts of the logged-in user.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    getAllDrafts(req, res, next) {
        try {
            const userId = req.cookies.userId;
            const drafts = PostModel.allDrafts(userId.email);
            res.status(200).json({ success: true, draft: drafts });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Toggle archive status of a post.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    archiveToggle(req, res, next) {
        try {
            const { postId } = req.params;
            const userId = req.cookies.userId.email;

            const response = PostModel.archive(postId, userId);
            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Fetch all archived posts.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    fetchAllArchivedPosts(req, res, next) {
        try {
            const userId = req.cookies.userId;
            const response = PostModel.allArchive(userId.email);
            res.status(response.status).json(response.res);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Fetch a single archived post by ID.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    fetchArchive(req, res, next) {
        try {
            const { postId } = req.params;
            const userId = req.cookies.userId;

            const response = PostModel.getArchive(postId, userId.email);
            res.status(response.status).json(response.res);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Bookmark a post.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    bookmark(req, res, next) {
        try {
            const { postId } = req.params;
            const userId = req.cookies.userId;

            const response = PostModel.bookmark(userId.email, postId);
            res.status(response.status).json(response.res);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Retrieve all bookmarked posts.
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    getBookmarks(req, res, next) {
        try {
            const userId = req.cookies.userId;
            const response = PostModel.fetchBookmark(userId.email);
            res.status(response.status).json(response.res);
        } catch (err) {
            next(err);
        }
    }
}