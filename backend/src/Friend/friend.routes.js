import express from 'express';
import FriendController from './friend.controller.js';

const friendRouter = express.Router();
const friendController = new FriendController();

friendRouter.get('/get-friends/:userId' , (req , res , next)=>{
    friendController.getFriends(req , res , next);
});


friendRouter.get('/get-pending-requests',(req , res , next)=>{
    friendController.getPendingFriendRequests(req , res , next);
});


friendRouter.post('/toggle-friendship/:friendId',(req , res , next)=>{
    friendController.toggleFriendRequest(req , res , next);
});


friendRouter.post('/response-to-request/:friendId',(req , res , next)=>{
    friendController.respondToFriendRequest(req , res , next);
});

export default friendRouter;
