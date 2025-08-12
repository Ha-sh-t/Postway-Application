import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.config.js";
import PostRepository from "../Post/post.repository.js";

class CommentRepository{

    constructor(){
        this.collection = getDB().collection('Comments')

    }

    async get(postId){
        const result = await this.collection
        .find({postId:new ObjectId(postId)})
        .sort({createdAt:1})
        .toArray();
        return result;
    }

    async findById(commentId){
        return await this.collection
        .findOne({_id:new ObjectId(commentId)});
    }

    async add(comment){
        const {insertedId} = await this.collection.insertOne(comment);
        const count = await this.getCommentsCount(comment.postId);
        await PostRepository.updateCommentCount(comment.postId , count);
        return {...comment , _id:insertedId};
    }

    async delete(commentId , postId){
        console.log("postId: " , postId)
        const {deletedCount} = await this.collection.deleteOne(
            {
                _id:new ObjectId(commentId),
            }
        );
        const count = await this.getCommentsCount(postId);
        await PostRepository.updateCommentCount(postId , count);
        return deletedCount;

    }

    async update(commentId , userId , content){
        if (content === undefined || content === null || content === '')
            return null;
        const result= await this.collection.findOneAndUpdate(
            { 
                _id: new ObjectId(commentId)
            },
            { $set: { content ,
                    updatedAt:new Date()
                }
            },
            { returnDocument: 'after' },
        );

        return result;
    }

    async getCommentsCount(postId){
        return await this.collection.countDocuments({postId:new ObjectId(postId)});
    }
    static async updateLikesCount(commentId , count){
        const collection = getDB().collection('Comments');
        await collection.findOneAndUpdate(
            {_id:new ObjectId(commentId)},
            {$set:{likes:count}}
        )
    }
}

export default CommentRepository;