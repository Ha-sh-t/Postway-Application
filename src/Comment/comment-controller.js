import CommentModel from "./comment-model";
class CommentController{


    createComment(req , res){
        const{id}  = req.params;//extracting id of user who commented  
        const {postId , content} = req.body;//extracting id of user who's post and comment content 
        const response = CommentModel.create(id , postId , content);
        res.status(201).json(response);
    }

    getComments(req , res){
        const{id} = req.params; //extracting id from req parameters e.g req:: '/api/comments/3' , 3 is id here
        const response = CommentModel.get(id);
        res.status(200).json(response);
    }

    deleteComment(req , res){
        const {id} = req.params;//extracting id from req params
        const response = CommentModel.delete(id); //calling model delete function to delete #id-comment from memory
        res.status(200).json(response); //sending response back to user received from comment model
    }

    updateComment(req , res){
        const{id} = req.params;//extracting user id of commentor
        const {content} = req.params ; //getting updated content of comment
        const response = CommentModel.update(id , content);//asking model to update the comment of user with userId = id
        res.status(200).json(response);
    }
}

export default CommentController;