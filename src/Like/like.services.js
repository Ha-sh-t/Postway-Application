import { ObjectId } from "mongodb";
import LikeRepository from "./like.repository.js";
import { NotFoundError, UnexpectedError, ValidationError } from "../error-handler/business.layer.error.js";
import LikeModel from "./like.model.js";
import PostRepository from "../Post/post.repository.js";
import CommentRepository from "../Comment/comment.repository.js";

export default class LikeServices {
    constructor() {
        this.likeRepository = new LikeRepository();
        this.postRepository = new PostRepository();
        this.commentRepository = new CommentRepository();
    }

    async getLikes(id) {
        if (!ObjectId.isValid(id)) throw new ValidationError("Invalid Id");
        const post = await this.postRepository.getByPostId(id)
        if (!post) {
            const comment = await this.commentRepository.findById(id);
            if (!comment) throw new NotFoundError("Nothing exists with this Id");
        };
        // const comments = await this.commentRepository.getCommentsCount(id);
        const likes = await this.likeRepository.getLikes(id);
        return {'success':true , 'data':likes};
    }

    async toggleLike(id, userId) {
        //is id of post or comment
        let item = "post";
        if (!await this.postRepository.getByPostId(id))
            if (!await this.commentRepository.findById(id))
                throw new ValidationError("Invalid Id");
            else item = "comment";
        const isLiked = await this.likeRepository.getLike(id, userId);
        if (isLiked) {
            const result = await this.likeRepository.remove(isLiked._id , item);

            if (!result || result.deletedCount <= 0) {
                throw new UnexpectedError("Failed to remove like.");
            }

            return { success: true, message: "Disliked successfully." };
        } else {

            const like = new LikeModel(new ObjectId(id), new ObjectId(userId), item);
            await this.likeRepository.addLike(like , item);

            return { success: true, message: "Liked successfully." };
        }
    }
}