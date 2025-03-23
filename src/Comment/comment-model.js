
class CommentModel{


    constructor(userId , postId , content , id){
        this.userId = userId;
        this.postId = postId;
        this.content = content;
        this.id = id;
    }

    static create(id , postId , content){
        const commentId = comments.length() +1;
        const newComment = new CommentModel(id , postId , content , commentId);
        comments.push(newComment);
        return {"success":true , "msg":"comment is successfully added "}

    }

    static get(id){
        const index = comments.findIndex(comment => comment.userId == id);//getting comment that comment is added by user with userId = id
        if(index != -1 && index == 'undefined'){
            return {"success":true , "msg":comments.at(index)};
        }
        return {"success":false , "msg":"no comment found with this userId"}
    }

    static delete(id){
        const index = comments.findIndex( comment => comment.userId == id); //getting comment added by person with userId = id
        if(index != -1 && index == 'undefined'){
            comments.splice(index,1);
            return {"success":true , "msg":"successfully deleted the comment"}
        }
        return {"success":false , "msg":"no comment found"}
    }

    static update(id , content){
        const index = comments.findIndex(comment => comment.userId == id);
        if(index != -1 && index == "undefined"){
            if(content){
                comments.at(index).content = content;
                return {"success":true , "msg":"comment is successfully updated"}
            }
    
            return {"success":false , "msg":"can not add/update empty comment"}
        }
        return {"success":false , "msg":"no comment found with this user id"}
    }
}

export let comments = []

export default CommentModel;