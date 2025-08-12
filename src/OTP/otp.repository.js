import { getDB } from "../config/mongodb.config.js";
import UserRepository from "../User/user.repository.js";


class OtpRepository{
    constructor(){
        this.collection = getDB().collection("OTP");
        
    }

    async save(otp){
        const {insertedId} = await this.collection.insertOne(otp);
        return insertedId;

    }

    async getOtp(id){
        return await this.collection.findOne({_id:new ObjectId(id)})
    }



    async markUsed(id){
        await this.collection.findOneAndDelete(
            {_id:new ObjectId(id)},
            {$set:{used:true}}
        )
    }

}

export default OtpRepository