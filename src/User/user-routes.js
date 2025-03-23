import express from 'express';
import UserController from './user-controller';

const userRouter = express.Router();

const userController = new UserController();
userRouter.get('/' ,userController.getAllUsers)
userRouter.post('/signup' , userController.register)
userRouter.post('/signin' , userController.login)
userRouter.get('/save/:postId',userController.savePost)
userRouter.get('/bookmark/:postId' , userController.bookmarkPost)

//exporting userRouter so that we can use it in index.js
export default userRouter;