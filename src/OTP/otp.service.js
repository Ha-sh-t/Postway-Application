import { ForbiddenError, NotFoundError, ValidationError } from "../error-handler/business.layer.error.js";
import UserRepository from "../User/user.repository.js";
import OtpModel from "./otp.model.js";
import OtpRepository from "./otp.repository.js";
import { hashPassword, isAuthentic, getOtp } from "../utils/password.utils.js";
import { buildHtml, sendEmail } from "../utils/mailer.utils.js";
import { generateJwtToken ,verifyJWTtoken} from "../utils/jwt.utils.js";
import { ObjectId } from "mongodb";
class OtpService {
    constructor() {
        this.otpRepository = new OtpRepository();
        this.userRepository = new UserRepository();
    }
    async sendOTP(email) {
        //verify user
        const user = await this.userRepository.find(email);
        if (!user) throw new NotFoundError("Please enter registered email.")

         //generate hash
        const plainOtp = await getOtp(); //ex: "123542"
        const hashedOtp = await hashPassword(plainOtp);
        
        //store otp doc
        const otpData = new OtpModel(new ObjectId(user._id), hashedOtp);
        const result = await this.otpRepository.save(otpData);

        const isSent = sendEmail(email, "Password Reset OTP" , buildHtml(user.name , plainOtp));
        return {success:true , message:'OTP sent to your registered email'};

    }

    async verifyOTP(otp,otpId , email) {
        //verify user
        const user = await this.userRepository.find(email);
        if (!user) throw new NotFoundError("Email is not registered.");
        
        //invalid otp id?
        const otpData = await this.otpRepository.getOtp(otpId);
        if(!otpData) throw new NotFoundError("Invalid OTP ID ");

        //expired or already used?
        if(otpData.used || otpData.expiresAt < Date.now()){
            throw new ForbiddenError("OTP is expired or already used.")
        }

        //otp validation
        const isOtpValid = await isAuthentic(otp , otpData.otp);
        if(!isValidOtp) throw new ValidationError("Invalid OTP")
        
        //mark OTP as used
        await this.otpRepository.markUsed(otpId);

        const token = generateJwtToken(user._id , email);//expires in 5min
        return {success:true , message:'OTP verified.' , token}
        
    }



    async resetPassword(newPassword, confirmPassword, email) {
        //verify token
        if(!await verifyJWTtoken(token)) throw new ValidationError("Password reset token is invalid or missing.")
        if (newPassword !== confirmPassword) 
            throw new ValidationError('Passwords do not match');
        
        //does user signed up?
        const user = await this.userRepository.find(email);
        if (!user) throw new NotFoundError('Email is not registered');

        const hashedPassword = await hashPassword(newPassword);
        await this.userRepository.updatePassword(user._id,hashedPassword);
        return {success:true , message:'Password reset successfully.'}

    }

}

export default OtpService;