import express from 'express';
import { uploadImage } from '../middleware/upload-post.middleware.js';
import PostController from './post.controller.js';

const postRouter = express.Router();
const postController = new PostController();

/**
 * @route POST /posts/
 * @desc Create a new post with image upload
 * @access Public/Protected (depending on auth middleware)
 */
postRouter.post('/', uploadImage('postUrl', 'posts'), (req, res, next) => {
    postController.createNewPost(req, res, next);
});

/**
 * @route GET /posts/all
 * @desc Get all posts
 * @access Public
 */
postRouter.get('/all', (req, res, next) => {
    postController.getAll(req, res, next);
});

/**
 * @route GET /posts/:postId
 * @desc Get a single post by postId
 * @access Public
 */
postRouter.get('/:postId', (req, res, next) => {
    postController.getPostByPostId(req, res, next);
});

/**
 * @route GET /posts/user/:userId
 * @desc Get all posts of a specific user
 * @access Public
 */
postRouter.get('/user/:userId', (req, res, next) => {
    postController.getPostsByUserId(req, res, next);
});

/**
 * @route PUT /posts/:postId
 * @desc Update an existing post with optional image replacement
 * @access Protected
 */
postRouter.put('/:postId', uploadImage('postUrl', 'posts'), (req, res, next) => {
    postController.updatePost(req, res, next);
});

/**
 * @route DELETE /posts/:postId
 * @desc Delete a post by ID
 * @access Protected
 */
postRouter.delete('/:postId', (req, res, next) => {
    postController.deletePost(req, res, next);
});


// ========== Draft Routes ==========

/**
 * @route PATCH /posts/draft/save
 * @desc Save a new draft post (or update an existing one)
 * @access Protected
 */
postRouter.patch('/draft/save', uploadImage('postUrl', 'posts'), postController.saveToDraft);

/**
 * @route PATCH /posts/draft/:draftId
 * @desc Update a specific draft by ID
 * @access Protected
 */
postRouter.patch('/draft/:draftId', uploadImage('postUrl', 'posts'), postController.saveToDraft);

/**
 * @route GET /posts/draft/all
 * @desc Get all draft posts of the logged-in user
 * @access Protected
 */
postRouter.get('/draft/all', postController.getAllDrafts);

/**
 * @route GET /posts/draft/:draftId
 * @desc Fetch a specific draft post by ID
 * @access Protected
 */
postRouter.get('/draft/:draftId', postController.fetchFromDraft);

/**
 * @route DELETE /posts/draft/:draftId
 * @desc Delete a draft post by ID
 * @access Protected
 */
postRouter.delete('/draft/:draftId', postController.deleteFromDraft);


// ========== Archive Routes ==========

/**
 * @route PATCH /posts/archive/:postId
 * @desc Toggle archive status for a post
 * @access Protected
 */
postRouter.patch('/archive/:postId', postController.archiveToggle);

/**
 * @route GET /posts/archive
 * @desc Get all archived posts of the user
 * @access Protected
 */
postRouter.get('/archive', postController.fetchAllArchivedPosts);

/**
 * @route GET /posts/archive/:postId
 * @desc Fetch a specific archived post
 * @access Protected
 */
postRouter.get('/archive/:postId', postController.fetchArchive);


// ========== Bookmark Routes ==========

/**
 * @route PATCH /posts/bookmark/:postId
 * @desc Add or remove a post from user's bookmarks
 * @access Protected
 */
postRouter.patch('/bookmark/:postId', postController.bookmark);

/**
 * @route GET /posts/bookmark
 * @desc Get all bookmarked posts of the user
 * @access Protected
 */
postRouter.get('/bookmark', postController.getBookmarks);

export default postRouter;