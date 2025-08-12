
import { comments } from "../Comment/comment.model.js";
import { ApplicationError } from "../error-handler/applicationError.js";
import { likes } from "../Like/like.model.js";

class PostModel{

    constructor(userId , caption , postUrl, content,date , likes = 0 , comments = 0 ){
        this.userId = userId;
        this.caption = caption ;
        this.postUrl = postUrl;
        this.date = date
        this.likes = likes;
        this.comments = comments;
        this.content = content;
    }



    //methods

    //create a new post
    static create(userId , caption , imageUrl){ 
        try{
            const id = posts.length + 1;
            const date = new Date();
            const newPost = new PostModel(userId , caption  ,imageUrl , id , date);
            
            posts.push(newPost);
            return {"success":true , "res":"post successfully added"}
        }
        catch(err){
            throw new Error(err.message)
        }
    }


    //change it since post does not have likes and comments features

    static sortPosts(n){
        const si = 4*(n-1)
        
        const sortedPosts = posts.sort((p1 , p2)=>{
            const l1 = likes.filter( like =>like.postId === p1.postId).length;
            const l2 = likes.filter (like => like.postId === p2.postId).length;
            const c1 = comments.filter(comment => comment.postId === p1.postId).length;
            const c2 = comments.filter(comment => comment.postId === p2.postId).length;
            const engagement1 = l1 + c1;
            const engagement2 = l2 + c2;

            if(engagement1 != engagement2) return engagement1 - engagement2;
            return new Date(p2.date) - new Date(p1.date);
        })

        //pagination 4 posts per page --
        return sortedPosts.filter((p , i)=> i >= si && i < si+4 && !p.flag.isArchived)
    }

    //fetching all posts in soreted manner with respect to date
    static getAll(n){
        try{
       
        const sorted_posts = this.sortPosts(n)
        
        return sorted_posts;
        }catch(err){
            throw new Error(err.message)
        }
    }

    
    static filter(caption){
        try{
            const filteredPosts = posts.filter(p => p.caption.toLowerCase().includes(caption.toLowerCase()));
            return {"success":true , "posts":filteredPosts}
        }
        catch(err){
            throw new Error(err.message)
        }

    }


    static get(id){
        try{
            const post = posts.find(p => p.id == id);
            return post;
        }
        catch(err){
            throw new Error(err.message)
        }
    }


    static delete(id , userId){
        try{
            const index = posts.findIndex(p => p.id == id && p.userId == userId.email);
     

            if(index == -1|| index == "undefined"){
                throw new ApplicationError("can't delete post with this id" , 400)
            }
            posts.splice(index , 1);
            return {"success":true , "msg":"successfully deleted"}
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    static update(id , userId , caption , imageUrl){
        try{
            const index = posts.findIndex(p => p.id == id && p.userId == userId);
            if(index == -1){
                throw new ApplicationError("no post found with this id" , 400)
            }
    
            caption ?posts[index].caption = caption:console.log("no caption to update");
            imageUrl ?posts[index].imageUrl = imageUrl:console.log("no imageUrl to update");
            
            return {"success":true , "msg":"successfully updated the post"}
        }
        catch(error){
            throw new Error(error.message)
        }
    }



    //draft
    static draft(caption , imageUrl , userId ,id){

        try{
            if(Number(id) >=0){
                const index = drafts.findIndex(d => d.userId == userId && d.id == id);
                //updating old draft
                drafts[index].caption = caption? caption:drafts[index].caption;
                drafts[index].imageUrl =imageUrl ? imageUrl : drafts[index].imageUrl;
            }
            else{
                const new_draft = {"caption":caption , "imageUrl":imageUrl , "userId" : userId , "id":drafts.length+1}
                drafts.push(new_draft);
            }
            return {"status":201,"res":{"success":true , "msg":"saved to draft !"} }
        }catch(error){
            throw new Error(error.message)
        }

        
    }

    static fetchDraft(userId , draftId){
        try{
            const fetched_draft = drafts.filter(d  => d.userId == userId && d.id == draftId);
            if(fetched_draft){
                return {"status":200 , "res":{"success":true , "msg":fetched_draft}}
            }
            throw new ApplicationError("no draft found" , 404)
        }catch(error){
            throw new Error(error.message)
        }
    }


    static deleteDraft(userId , draftId){
        try{
            const fetched_draft_index = drafts.findIndex(d  => d.userId == userId && d.id == draftId);
            if(fetched_draft_index != -1){
                drafts.splice(fetched_draft_index , 1)
                return {"status":200 , "res":{"success":true , "msg":"removed  the draft !"}}
            }
            throw new ApplicationError("no draft found" , 404)
        }catch(error){
            throw new Error(error.message)
        }
      
    }

    static allDrafts(userId){
        try{
            const drafts_ = drafts.filter(d => d.userId == userId);
            return drafts_
        }
        catch(error){
            throw new Error(error.message)
        }
    }


    //archive
    static archive(postId , userId ){
        try{
            const post = posts.find(p=> p.id == postId );

            if(!post){
                throw new ApplicationError("no post found error" , 400)
            
            }
            if(post && post.flag.isArchived) {
                post.flag.isArchived = false;
                post.flag.archiveId = null;
                return {"status":200 , "res":{"success":true , "msg":"post is  unarchived!"}}
            }else{
                post.flag.isArchived = true;
                post.flag.archiveId = userId
                return {"status":200 , "res":{"success" : true , "msg":"archived the post successfully!"}}  
            }
        }
        catch(error){
            throw new Error(error.message)
        }
    }

    static allArchive(userId){
        const archive_posts = posts.filter(post => post.flag.isArchived && post.flag.archiveId == userId)
        return {"status":200 , "res":archive_posts}
    }

    static getArchive(postId , userId){
        try{
            const archive_post = posts.filter(post => post.id == postId && post.flag.isArchived && post.flag.archiveId == userId);
            if(archive_post){
                return {"status":200 , "res":{"success":true , "msg":archive_post}}
            }
            throw new ApplicationError("post not found error" , 404)
        }catch(error){
            throw new Error(error.message)
        }
    }



    static bookmark(userId , postId){

        try{
            const post_ = posts.find(post=> post.id == postId);

            if(post_){
                post_.flag.bookmark = !post_.flag.bookmark;
                post_.flag.bookmarkId = post_.flag.bookmarkId ? null: userId;
     
                console.log("post_:" , post_)
                return {"status":200 , "res":{"success":true , "msg":"bookmarked successfully!"}}
            }
            throw new ApplicationError("no post found error in bookmark !" , 400)
        }
        catch(error){
            console.error(error);
            throw new Error(error.message);
        }

    }


    static fetchBookmark(userId){
        try{
            const bookmark_posts = posts.filter(post=>post.flag.bookmarkId == userId && post.flag.bookmark);
            return {"status":200 , "res":{"success":true , "msg":bookmark_posts}}
        }
        catch(error){
            throw new Error(error.message)
        }
    }


}

let  posts = [
    new PostModel(
      "user_1",
      "Enjoying the beach vibes 🌊",
      "/media/posts/beach.jpg",
      "post_101",
      "2025-06-01",
      { isArchived: false, draft: false, bookmark: true }
    ),

    new PostModel(
      "user_3",
      "Sunset view from the hill 🌄",
      "/media/posts/sunset.jpg",
      "post_103",
      "2025-05-29",
      { isArchived: false, draft: false, bookmark: false }
    ),


  ];

  let drafts = [  
    {
        "caption":"New sketch I'm working on ✏️",
        "imageUrl":"/media/posts/sketch.png",
        "id":1,
        "userId":"harshit@example.com"
    },
    {

        "caption":"Work in progress 👨‍💻",
        "imageUrl":"/media/posts/code.png",
        "id":2,
        "userId":"anjali@example.com"
    },

    ]
  let bookmark = [
    {"id":"post_105" , "date":"2025-06-5"} ,
    {"id":"post_101" , "date":"2025-05-29"}
    ]


export default PostModel;


