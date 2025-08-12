import  './src/config/dotenv.config.js'

import cookieParser from 'cookie-parser';
import express from 'express';
import commentRouter from './src/Comment/comment.routes.js';
import likeRouter from './src/Like/like.routes.js';
import postRouter from './src/Post/post.routes.js';
import userRouter from './src/User/user.routes.js';
import friendRouter from './src/Friend/friend.routes.js';
import jwtAuth from './src/middleware/jwt.middleware.js';
import cors from 'cors'
import { errorHandler } from './src/middleware/error.handler.middleware.js';
import loggerMiddleWare from './src/middleware/logger.middleware.js';
import { connectToMongoDB } from './src/config/mongodb.config.js';
import session from 'express-session'
import { sessionAuth } from './src/middleware/sessionAuth.middleware.js';
import otpRouter from './src/OTP/otp.routes.js';
const app = express();
app.use(cors({
    origin:'http://localhost:5500',
    credentials:true
}));  


app.use(express.static('./src/'))

app.use(cookieParser())
app.use(express.urlencoded({extended:true})); //parsing url data to json
app.use(express.json())
app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        maxAge:1000*60*30 // 30 min
    }
}))
//handling different routes to server------------
app.use('/api/users',userRouter)
app.use('/api/posts', sessionAuth , postRouter);
app.use('/api/comments',sessionAuth, commentRouter);
app.use('/api/likes',sessionAuth ,likeRouter);
app.use('/api/friends',sessionAuth , friendRouter)
app.use('/api/otp',otpRouter)
app.use(errorHandler)
app.use('/',(req , res,next)=>{
    res.send("Please check your api end point.")
})
const port = process.env.PORT
app.listen(port , async ()=>{
    console.log("server is running on port 3000.")
    try{
        await connectToMongoDB();
    }catch(err){
        console.log("failed to connect mongodb");
        console.error(err)
    }
})