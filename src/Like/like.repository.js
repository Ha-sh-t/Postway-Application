import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.config.js";
import PostRepository from "../Post/post.repository.js";
import CommentRepository from "../Comment/comment.repository.js";

class LikeRepository {

    constructor() {
        this.collection = getDB().collection('Likes')
    }

    async getLikesCount(id) {
        return await this.collection.countDocuments({ itemId: new ObjectId(id) });
    }

    async addLike(like , item) {
        const { insertedId } = await this.collection.insertOne(like);
        const count = await this.getLikesCount(like.itemId);
        console.log("count:",count);
        if (item == "post"){
            PostRepository.updateLikesCount(like.itemId ,count);
        }
        else{
            CommentRepository.updateLikesCount(like.itemId , count);
        }
        return { ...like, insertedId };
    }
    async remove(id , item) {
        const { deletedCount } = await this.collection.deleteOne({ _id: new ObjectId(id) })
        const count = this.getLikesCount(id);
        if (item == "post"){
            PostRepository.updateLikesCount(id ,count);
        }
        else{
            CommentRepository.updateLikesCount(id , count);
        }
        return deletedCount;
    }

    async getLike(id ,userId) {
        return await this.collection.findOne(
            {
                itemId: new ObjectId(id),
                userId: new ObjectId(userId)
            }
        );
    }
        async getLikes(id) {
        const likes =  await this.collection.find(
            {
                itemId: new ObjectId(id)
            }
        ).toArray();
        console.log(likes);
        return likes;
    }
}

export default LikeRepository;