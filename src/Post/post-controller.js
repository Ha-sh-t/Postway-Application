import PostModel from "./post-model";

export default class PostController{
    constructor(){

    }

    createNewPost(req , res){
        const {caption} = req.body;
        const {userId } = req.cookies.userId;
        const imageUrl = '../media/posts' + req.file.filename;
        const response = PostModel.create(userId , caption , imageUrl);
        res.status(201).json(response);
    }


    getAllPosts(req,res){
        const {page} = req.params;
        const post = PostModel.getAll(page);
        res.send(post);
    }

    getPost(req,res){
        const {id} = req.params;
        const post = PostModel.get(id);
        res.send(post);
    }

    deletePost(req,res){
        const {id} = req.params;
        const response = PostModel.delete(id);
        res.status(200).json(response);
    }

    updatePost(req,res){
        const {id} = req.params;
        const {caption , imageUrl} = req.body;
        const response = PostModel.update(id , caption , imageUrl);
        res.status(200).json(response);
    }

    filterPost(req , res){
        //this filter matching based on exact caption matching
        const {caption} = req.query;
        const response = PostModel.filter(caption);
        res.status(200).json(response);
    }
    archivePost(req , res){
        const {postId} = req.params;
        const response = PostModel.archive(postId);
        res.status(200).json(response);
    }
    bookmarkPost(req, res){

    }

    
}