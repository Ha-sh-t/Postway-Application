
export default class OtpModel{
    constructor(userId , otp ,used=false){
        this.otp=otp;
      
        this.createdAt=new Date();
        this.expiresAt = new Date() + 5*60*1000;
        this.used = used
    }
}