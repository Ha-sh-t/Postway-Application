
class LikeModel{

    constructor(userId , postId , id){
        
    }

    static getAll(){
        return likes;
    }

    static add(likeInfo){

    }

    static remove(id){

    }
    static toggle(postId , userId){
        const index = likes.findIndex(like => like.postId == postId);
        const id = likes.length()+1;
        if(index != -1 && index != 'undefined'){
            likes.at(index).userId == userId ? likes.splice(index,1) :likes.push(new LikeModel(userId , postId , id));
            return {"success":true , "msg":"toggled like successfully"}
        }

        return {"success":false , "msg":"no post found"}
    }
}


export let likes = []
export default LikeModel;