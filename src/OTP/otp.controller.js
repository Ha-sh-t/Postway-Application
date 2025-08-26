import OtpService from "./otp.service.js";
import { ApplicationError } from "../error-handler/applicationError.js";

/**
 * Controller for handling OTP related work.
 * This connects the request/response cycle with the service layer.
 */
class OtpController {
  constructor() {
    // we create a service object here so we can call its functions
    this.otpService = new OtpService();
  }

  /**
   * Send OTP to user (mostly on email).
   * Expects "email" in request body.
   */
  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) throw new ApplicationError("Email is required", 400);

      const result = await this.otpService.sendOTP(email);
      res.status(201).json(result);  // send back success response
    } catch (error) {
      next(error); // pass error to middleware
    }
  }

  /**
   * Verify the OTP entered by the user.
   * Needs otpId, otp, and email in request body.
   */
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

  /**
   * Reset user password after OTP is verified.
   * Needs email, newPassword, confirmPassword in body
   * and token in query params.
   */
  async resetPassword(req, res, next) {
    try {
      const { newPassword, confirmPassword, email } = req.body;
      const { token } = req.query;

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