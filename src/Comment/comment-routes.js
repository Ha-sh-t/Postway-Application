import express from 'express';
import CommentController from './comment-controller';

const commentRouter = express.Router();
const commentController  = new CommentController();


commentRouter.post('/:id' , commentController.createComment);
commentRouter.get('/:id',commentController.getComments)
commentRouter.delete('/:id',commentController.deleteComment);
commentRouter.put('/:id',commentController.updateComment);


export default commentRouter;