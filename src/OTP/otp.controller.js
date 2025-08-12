import OtpService from "./otp.service.js";
import { ApplicationError } from "../error-handler/applicationError.js";

class OtpController {
  constructor() {
    this.otpService = new OtpService();
  }

  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) throw new ApplicationError("Email is required", 400);

      const result = await this.otpService.sendOTP(email);
      res.status(201).json(result);  // forward service-layer structure
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { otpId, otp, email } = req.body;
      if (!otpId || !otp || !email) {
        throw new ApplicationError("OTP ID, OTP, and email are required", 400);
      }

      const result = await this.otpService.verifyOTP(otpId, otp, email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { newPassword, confirmPassword, email} = req.body;
      const {token} = req.query;
      if (!newPassword || !confirmPassword || !email) {
        throw new ApplicationError("All fields are required", 400);
      }

      const result = await this.otpService.resetPassword(
        email,
        newPassword,
        confirmPassword,
        token
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default OtpController;