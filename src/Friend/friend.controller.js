import FriendServices from "./friend.services.js";

class FriendController{
    constructor(){
        this.friendServices = new FriendServices();
        // this.userId = req.session.user._id;
    }

    async getFriends(req , res , next){ 
        try{
            console.log("get Friends api endpoint called.")
            const {userId} = req.params;
            const response = await this.friendServices.getFriends(userId);
            res.json(response);
        }
        catch(error){
            next(error);
        }

    }

    async getPendingFriendRequests(req , res , next){
        try{
            const userId = req.session.user._id;
            const pendingList = await this.friendServices.getPendingRequests(userId);
            res.json(pendingList)
            
        }
        catch(error){
            next(error);
        }
    }

    async toggleFriendRequest(req , res , next){
        try{
            const {friendId} = req.params;
            const userId = req.session.user._id
            const response = await this.friendServices.toggleFriendRequest(friendId ,userId);
            res.json({data:response})
        }
        catch(error){
            next(error);
        }
    }

    async respondToFriendRequest(req , res , next){
        try{
            const {action} = req.body;
            const {friendId} = req.params;
            const userId = req.session.user._id;
            const response = await this.friendServices.respondToFriendRequest(friendId,userId , action);

            res.json({data:response})

        }
        catch(error){
            next(error);
        }
    }
}

export default FriendController