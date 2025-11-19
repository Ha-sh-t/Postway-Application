/**
 * @file comment.routes.js
 * @description Express router for handling user comments ,create , update , delete like operations
 * 
 * @requires express
 * @requires ./comment.controller.js
 */
import express from 'express';
import CommentController from './comment.controller.js';

const commentRouter = express.Router();
const commentController  = new CommentController();

/**
 * @route POST: /api/comments/:postId
 * @desc Add a new comment on a post
 * @access private
 */
commentRouter.post('/:postId' , (req ,res ,next)=>{
    commentController.addComment(req , res , next)
});
/**
 * @route GET: /api/comments/:postId
 * @desc Retrieve all comments on a post
 * @access private
 */
commentRouter.get('/:postId', (req , res , next)=>{
    commentController.getComments(req , res , next)
})
/**
 * @route DELETE: /api/comments/:commentId
 * @desc Delete a comment on a post
 * @access private
 */
commentRouter.delete('/:commentId',(req , res, next)=>{
    commentController.deleteComment(req ,res , next)
});
/**
 * @route PUT: /api/comments/:commentId
 * @desc Update a comment on a post
 * @access private
 */
commentRouter.put('/:commentId', (req ,res , next)=>{
    commentController.updateComment(req , res , next)
});


export default commentRouter;