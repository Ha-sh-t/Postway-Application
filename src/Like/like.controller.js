
import LikeServices from "./like.services.js";
class LikeController{
    constructor(){
        this.likeServices = new LikeServices()
    }

    async getLikes(req, res , next){
        try{
            const {id} = req.params; //extracting postId from req-url parameters
            
            const response = await this.likeServices.getLikes(id);
            
            res.send(response);
        }catch(err){
            next(err)
        }

    }

    
    async toggleLike(req , res , next){
        try{
            const {id} = req.params;
            const userId = req.session.user._id;
            const response = await this.likeServices.toggleLike(id , userId);

            res.json(response);
        }
        catch(err){
            next(err)
        }

    }
}

export default LikeController;