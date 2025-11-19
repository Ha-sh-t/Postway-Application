import { getDB } from "../config/mongodb.config.js";
import { ObjectId } from "mongodb";

class FriendRepository {
    constructor() {
        this.collection = getDB().collection("Friends");
    }

    async getFriends(userId) {
        return await this.collection
            .find({  friendId: new ObjectId(userId), pending: false })
            .sort({ createdAt: 1 })
            .toArray();
    }

    async addFriend(friend) {
        const { insertedId } = await this.collection.insertOne(friend);
        return { ...friend, insertedId };
    }

    async getPendingRequests(userId) {
        return await this.collection
            .find({ userId: new ObjectId(userId), pending: true })
            .sort({ createdAt: 1 })
            .toArray();
    }

    async remove(id) {
        const { deletedCount } = await this.collection.deleteOne({ _id: new ObjectId(id) });
        return deletedCount;
    }

    async getPendingRequest(friendId, userId) {
        return await this.collection.findOne({
            friendId: new ObjectId(friendId),
            userId: new ObjectId(userId),
            pending:true
        });
    }
    async getPendingFriendRequest(friendId , userId){
        return await this.collection.findOne({
            friendId:new ObjectId(userId),
            userId:new ObjectId(friendId),
            pending:true
        })
    }

    async accept(id) {
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { pending: false } },
            {
                returnDocument: "after",
                projection: { pending: 1 },
            }
        );
        return result;
    }

    async getFriend(friendId , userId){
        return await this.collection.findOne(
            {friendId:new ObjectId(userId) ,
                userId:new ObjectId(friendId),pending:false});
    }
}

export default FriendRepository;