import { ForbiddenError, NotFoundError, ValidationError } from "../error-handler/business.layer.error.js";
import UserRepository from "../User/user.repository.js";
import OtpModel from "./otp.model.js";
import OtpRepository from "./otp.repository.js";
import { hashPassword, isAuthentic, getOtp } from "../utils/password.utils.js";
import { buildHtml, sendEmail } from "../utils/mailer.utils.js";
import { generateJwtToken, verifyJWTtoken } from "../utils/jwt.utils.js";
import { ObjectId } from "mongodb";

/**
 * Service layer for OTP (One-Time Password) stuff.
 * Does the actual logic (DB work, validations, etc.)
 */
class OtpService {
    constructor() {
        this.otpRepository = new OtpRepository();
        this.userRepository = new UserRepository();
    }

    /**
     * Step 1: Send OTP to the user's email
     * - Check if user exists
     * - Generate a random OTP
     * - Hash and store it in DB
     * - Email the OTP to user
     */
    async sendOTP(email) {
        // find user in DB
        const user = await this.userRepository.find(email);
        if (!user) throw new NotFoundError("Please enter registered email.");

        // generate plain OTP (e.g. "123456")
        const plainOtp = await getOtp();
        const hashedOtp = await hashPassword(plainOtp);

        // save OTP document in DB
        const otpData = new OtpModel(new ObjectId(user._id), hashedOtp);
        await this.otpRepository.save(otpData);

        // send OTP via email
        sendEmail(email, "Password Reset OTP", buildHtml(user.name, plainOtp));

        return { success: true, message: "OTP sent to your registered email" };
    }

    /**
     * Step 2: Verify OTP entered by user
     * - Make sure user exists
     * - Validate OTP ID from DB
     * - Check if OTP is still valid (not expired or used)
     * - Compare entered OTP with stored hashed one
     * - If correct, generate a short-lived token
     */
    async verifyOTP(otp, otpId, email) {
        // verify user
        const user = await this.userRepository.find(email);
        if (!user) throw new NotFoundError("Email is not registered.");

        // check if otp record exists
        const otpData = await this.otpRepository.getOtp(otpId);
        if (!otpData) throw new NotFoundError("Invalid OTP ID");

        // check if otp expired or already used
        if (otpData.used || otpData.expiresAt < Date.now()) {
            throw new ForbiddenError("OTP is expired or already used.");
        }

        // compare entered otp with stored hashed otp
        const isOtpValid = await isAuthentic(otp, otpData.otp);
        if (!isOtpValid) throw new ValidationError("Invalid OTP");

        // mark OTP as used
        await this.otpRepository.markUsed(otpId);

        // create a temporary JWT token (valid for 5 mins)
        const token = generateJwtToken(user._id, email);

        return { success: true, message: "OTP verified.", token };
    }

    /**
     * Step 3: Reset Password
     * - Needs token (from OTP verification step)
     * - Checks if newPassword === confirmPassword
     * - Hash new password and update DB
     */
    async resetPassword(newPassword, confirmPassword, email, token) {
        // verify reset token
        if (!await verifyJWTtoken(token)) {
            throw new ValidationError("Password reset token is invalid or missing.");
        }

        // both passwords must match
        if (newPassword !== confirmPassword) {
            throw new ValidationError("Passwords do not match");
        }

        // check if user exists
        const user = await this.userRepository.find(email);
        if (!user) throw new NotFoundError("Email is not registered");

        // hash new password and save in DB
        const hashedPassword = await hashPassword(newPassword);
        await this.userRepository.updatePassword(user._id, hashedPassword);

        return { success: true, message: "Password reset successfully." };
    }
}

export default OtpService;