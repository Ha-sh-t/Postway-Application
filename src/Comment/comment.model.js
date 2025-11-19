import { ApplicationError } from "../error-handler/applicationError.js";

class CommentModel{


    constructor(userId , postId , content ,createdAt , likes=0){
        this.userId = userId;
        this.postId = postId;
        this.likes = likes;
        this.content = content;
        this.createdAt = createdAt;

    }

    static create(id , postId , content){

        try{
            const commentId = comments.length +1;
            const newComment = new CommentModel(id , postId , content , commentId);
            comments.push(newComment);
            return {"success":true , "msg":"comment is successfully added "}
        }catch(err){
            throw new Error(err.message) ;
        }

    }

    static get(id){
        try{
            const comments_filtered = comments.filter(comment => comment.postId == id);//getting comments of post with postId = postId
            if(comments_filtered.length){
                return {"success":true , "msg":comments_filtered};
            }
            throw new ApplicationError("no comment yet" , 400)
        }catch(err){
            throw new Error(err.message)
        }

    }

    static delete(userId , postId){
        try{
            const index = comments.findIndex( comment => comment.userId == userId && comment.postId == postId); //getting comment added by person with userId = id
            if(index != -1 || index != 'undefined'){
                comments.splice(index,1);
                return {"success":true , "msg":"successfully deleted the comment"}
            }
            throw new ApplicationError("no comment to delete " , 400)         
        }
        catch(err){
            throw new Error(err.message);
        }


    }

    static update(userId , postId , content){
        try{
            const index = comments.findIndex(comment => comment.userId == userId && comment.postId == postId);
            if(index != -1 || index != "undefined"){
                if(content){
                    comments.at(index).content = content;
                    return {"success":true , "msg":"comment is successfully updated"}
                }
        
                return {"success":true , "msg":"nothing to update"}
            }
            throw new ApplicationError("no comment found to update" , 400)

        }catch(err){
            throw new Error(err.message)
        }

    }
}



export default CommentModel;
export let comments = [
    new CommentModel("user101", "post001", "This post really helped me understand the topic. Thanks!", "cmt001"),
    new CommentModel("user102", "post001", "Interesting perspective. I hadn't thought of it that way.", "cmt002"),
    new CommentModel("user103", "post002", "Can you explain more about the last part?", "cmt003"),
    new CommentModel("user104", "post003", "Totally agree with your points!", "cmt004"),
    new CommentModel("user105", "post002", "Great content. Looking forward to more posts like this.", "cmt005"),
    new CommentModel("user106", "post004", "I have a different opinion, but still a good read.", "cmt006"),
    new CommentModel("user107", "post001", "Loved this. Saved it for later reference.", "cmt007"),
    new CommentModel("user108", "post003", "This clarified a lot of my doubts. Appreciate it!", "cmt008"),
    new CommentModel("user109", "post005", "Where can I find more details on this?", "cmt009"),
    new CommentModel("user110", "post005", "Nice post! Keep sharing such insights.", "cmt010")
];


