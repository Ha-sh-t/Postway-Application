import cookieParser from 'cookie-parser';
import express from 'express';
import commentRouter from './src/Comment/comment-routes';
import likeRouter from './src/Like/like-routes';
import postRouter from './src/Post/post-routes';
import userRouter from './src/User/user-routes';
import jwtAuth from './src/middleware/jwt.middleware.js';

const app = express();
app.use(express.urlencoded({extended:true})); //parsing url data to json
app.get('/' , (req , res)=>{
    res.send("Welcome to postway !")
})
app.use(cookieParser())
//handling different routes to server------------
app.use('/api',userRouter)
app.use('/api/posts', jwtAuth , postRouter);
app.use('/api/comments',jwtAuth, commentRouter);
app.use('/api/likes',jwtAuth ,likeRouter);


app.listen(3000 , ()=>{
    console.log("server is running on port 3000 ...")
})