import jwt from 'jsonwebtoken';
import UserModel from "./user-model.js";
// const userModel = new UserModel();
export default class UserController {

    getAllUsers(req , res){
        //code here
        const users =UserModel.getAllUsers();
        res.send(users);
    }

    register(req , res){
        //code here
        const {email} = req.body
        const response = UserModel.addUser(req.body);
        const token = jwt.sign({email} , 'Secretkey' , {expiresIn:'1h'})
        res.cookie("token" , {token})
        res.status(response.status).json(response.res);
        
    }


    login(req , res){
        //code here
        const {email , password} = req.body;
        const response = UserModel.confirmLogin(email , password);
        if(response.status){
            res.cookie("userId",{email})
        }
        res.status(response.status).json(response.res);
    }

    savePost(req , res){
        const {userId} = req.cookie;
        const {postId} = req.params;

        const response = UserModel.saveToDraft(userId , postId);

        res.status(200).json(response);
    }

    bookmarkPost(req , res){
        const {userId} = req.cookie;
        const {postId} = req.params;

        const response = UserModel.bookmark(userId , postId);

        res.status(200).json(response);
    }
}