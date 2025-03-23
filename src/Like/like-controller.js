import LikeModel from "./like-model";
class LikeController{

    getAllLikes(req, res){
        const {postId} = req.params; //extracting postId from req-url parameters
        const response = LikeModel.getAll(postId);
        res.status(200).json(response);
    }

    

    toggleLike(req , res){
        const {postId} = req.params;
        const response = LikeModel.toggle(postId);
        res.status(200).json(response);
    }
}

export default LikeController;