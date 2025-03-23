
import { comments } from "../Comment/comment-model.js";
import { likes } from "../Like/like-model.js";

class PostModel{

    constructor(userId , caption , imageUrl , id , isArchived=false , date){
        this.userId = userId;
        this.caption = caption ;
        this.imageUrl = imageUrl;
        this.id = id;
        this.isArchived=isArchived;
        this.date = date
    }



    //methods

    static create(userId , caption , imageUrl){
        const id = posts.length() + 1;
        const date = new Date();
        const newPost = new PostModel(userId , caption  ,imageUrl , id , date);
        
        posts.push(newPost);
        return {"success":true , "res":"post successfully added"}
    }
    static archive(postId){
        const post = posts.find(p=> p.postId === postId);
        if(!post) return {"success":false , "msg":"post not found !"} ;
        posts.isArchived = true;
        return {"success" : true , "msg":"archived the post successfully!"}  
    }

    //change it since post does not have likes and comments features
    static sortPosts(n){
        const si = 4*(n-1)
        
        const sortedPosts = posts.sort((p1 , p2)=>{
            const l1 = likes.filter( like =>like.postId === p1.postId).length();
            const l2 = likes.filter (like => like.postId === p2.postId).length();
            const c1 = comments.filter(comment => comment.postId === p1.postId).length();
            const c2 = comments.filter(comment => comment.postId === p2.postId).length();
            const engagement1 = l1 + c1;
            const engagement2 = l2 + c2;

            if(engagement1 != engagement2) return engagement1 - engagement2;
            return new Date(p1.date) - new Date(p2.date);
        })

        //pagination 4 posts per page --
        return sortedPosts.filter((p , i)=>  si >= si && si < si+4 )
    }
    static getAll(n){

        return this.sortPosts(n);
    }

    
    static postFilter(caption , n){
        const filteredPosts = posts.filter(p => p.caption.toLowercase().includes(caption.toLowercase()));
        return {"success":true , "posts":filteredPosts}
    }


    static get(id){
        const post = posts.find(p => p.id == id);
        return post;
    }


    static delete(id){
        const index = posts.findIndex(p => p.id == id);
        posts.splice(index , 1);
        return {"success":true , "msg":"successfully deleted"}
    }

    static update(id , caption , imageUrl){
        const index = posts.findIndex(p => p.id == id);
        caption ?posts[index].caption = caption:console.log("no caption to update");
        imageUrl ?posts[index].imageUrl = imageUrl:console.log("no imageUrl to update");
        
        return {"success":true , "msg":"successfully updated the post"}
    }


}

let posts = [];

export default PostModel;