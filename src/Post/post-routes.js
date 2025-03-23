
import express from 'express';
import { uploadImage } from '../middleware/upload-post.middleware';
import PostController from './post-controller';


const postRouter = express.Router();

const postController = new PostController();

postRouter.post('/' , uploadImage.single('imageUrl'), postController.createNewPost);
postRouter.get('/all/:page',postController.getAllPosts);
postRouter.get('/:id' ,postController.getPost);
postRouter.delete('/:id',postController.deletePost);
postRouter.put('/:id',postController.updatePost);
postRouter.get('/filter',postController.filterPost);
postRouter.get('/archive/:postId' , postController.archivePost);


export default postRouter;

//0 1 2 3 4 5 6 7 8 9 10 11 12 13
//1: 0-3
//2: 4-7
//3: 8-11
//4: 
//starting index : 4(n-1) since i am assuming 4 post per page
//ending index : 4(n-1) + 4