import { NotFoundError, UnexpectedError, ValidationError } from "../error-handler/business.layer.error.js";
import FriendRepository from "./friend.repository.js";
import { ObjectId } from "mongodb";
import FriendModel from "./friend.model.js"; // You must import this

class FriendServices {
    constructor() {
        this.friendRepository = new FriendRepository();
    }

    async getFriends(userId) {
        if (!ObjectId.isValid(userId)) throw new ValidationError("Invalid userId");
        const friendList =  await this.friendRepository.getFriends(userId);
        return {success:true , data:friendList};
    }

    async getPendingRequests(userId) {
        if(!ObjectId.isValid(userId)) throw new ValidationError("Invalid userId.");
        const pendingList = await this.friendRepository.getPendingRequests(userId);
        return {success:true , data:pendingList};
    }

    async toggleFriendRequest(friendId, userId) {
        if (!ObjectId.isValid(friendId)) throw new ValidationError("Invalid friendId");
        if (!ObjectId.isValid(userId)) throw new ValidationError("Invalid userId");
        if(friendId.toString() == userId.toString()) throw new ValidationError("FriendId should not same as userId")

        const friend = await this.friendRepository.getFriend(friendId, userId);
        const pendingRequest = await this.friendRepository.getPendingRequest(friendId , userId);

        if (!friend && !pendingRequest) {
            const newFriend = new FriendModel(new ObjectId(friendId), new ObjectId(userId), true);
            const result = await this.friendRepository.addFriend(newFriend);
            if (!result) throw new UnexpectedError("Unable to send friend request, try again later.");
            return { message: "Friend request has been sent." };
        }
        const _id = pendingRequest?pendingRequest._id:friend._id;
        const result = await this.friendRepository.remove(_id);
        if (!result || result <= 0) throw new UnexpectedError("Unable to remove, try again later.");
        return { message: "Friend request has been removed." };
    }

    async respondToFriendRequest(friendId, userId, action) {
        if (!ObjectId.isValid(userId)) throw new ValidationError("Invalid userId");
        if (!ObjectId.isValid(friendId)) throw new ValidationError("Invalid friendId");
        if(friendId.toString() == userId.toString()) throw new ValidationError("FriendId should not same as userId")


        const friendRequest = await this.friendRepository.getPendingFriendRequest(friendId, userId);
        if (!friendRequest) throw new NotFoundError("Pending friend request not found.");

        const normalizedAction = action?.trim().toLowerCase();

        if (normalizedAction === "accept") {
            const result = await this.friendRepository.accept(friendRequest._id);
            if (!result) throw new UnexpectedError("Unable to accept request, try again later.");
            return { success:true , message: "Friend request accepted." };
        }

        if (normalizedAction === "reject") {
            const result = await this.friendRepository.remove(friendRequest._id);
            if (!result) throw new Error("Unable to reject, try again later.");
            return { success:true , message: "Friend request rejected." };
        }

        throw new ValidationError("Invalid action. Use 'accept' or 'reject'.");
    }
}

export default FriendServices;