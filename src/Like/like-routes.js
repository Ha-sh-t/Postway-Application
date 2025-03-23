import express from 'express';
import LikeController from './like-controller';

const likeRouter = express.Router();
const likeController = new LikeController();


likeRouter.get('/toggle/:postId' ,likeController.toggleLike);
likeController.get('/:postId',likeController.getAllLikes)

export default likeRouter;