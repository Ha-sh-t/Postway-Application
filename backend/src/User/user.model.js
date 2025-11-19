import { ApplicationError } from "../error-handler/applicationError.js";


class UserModel{
    constructor(name , email ,gender, password  ){
        this.name = name;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.avatarUrl = undefined
    }
}

export default UserModel;

