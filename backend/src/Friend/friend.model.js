

class FriendModel{
    constructor(friendId , userId , pending = true ){
        this.friendId = friendId;
        this.userId = userId;
        this.pending = pending;
        this.createdAt = new Date()
    }
}

export default FriendModel;