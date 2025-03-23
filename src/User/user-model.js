

class UserModel{
    constructor(name , email , password , id){
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static getAllUsers(){
        return users;
    }

    static addUser(userInfo){
        const{name , email , password} = userInfo;
        const id = users.length +1;
        let newUser = new UserModel(name , email , password , id);
        users.push(newUser);
        return {
            "res":{"success":true , "msg":"registered successfully !"} ,"status":201}
    }

    static confirmLogin(loginInfo){
        const{email , password} = loginInfo;

        //check for user existence
        const user = users.find(user=>user.email === email);

        //now confirm password
        if(user){
            if(user.password === password){
                //login success response
                return {"res":{"success":true , "msg":"logIn successfully"},"status":200};
            }
            else{
                //wrong password response
                return {"res":{"success":false , "msg":"wrong password"},"status":400};
            }
        }
        //email not found response
        return {"res":{"success":false , "msg":"user not found" },"status":"404"};
    }

    static saveToDraft(userId , postId){
        //first search or existing user
        const user = users.find(u => u.userId === userId);
        if(!user) return {"success":false , "msg":"user not found"};
        if(!user.draft){
            user.draft = [];
        }
        user.draft.push(postId);
        return {"success":true , "msg":"post is successfully saved!"}
    }

    static bookmark(userId , postId){
        //lets find the user
        const user = users.find( user => user.userId === userId);
        if(!user) return {"success":false , "msg":"user not found"};
        if(!user.bookmarks)
        {
            user.bookmarks =[];
        }
        user.bookmarks.push(postId);
        return {"success":true , "msg":"added to bookmarks successfully !"};


    }
}

let users =[ {"name":"John" ,"email":"John@example.com" , "password":1234 , "id":1}];
export default UserModel;