import express from 'express';
import OtpController from './otp.controller.js';

// Router for OTP related APIs
const otpRouter = express.Router();

// Controller has all the functions (send, verify, reset)
const otpController = new OtpController();

/**
 * Send OTP to user (for example on email/phone).
 * Expects user info in the request body.
 */
otpRouter.post('/send', (req, res, next) => {
    otpController.sendOtp(req, res, next);
});

/**
 * Verify the OTP entered by the user.
 * Checks if OTP is correct or expired.
 */
otpRouter.post('/verify', (req, res, next) => {
    otpController.verifyOtp(req, res, next);
});

/**
 * Reset user password after OTP verification.
 * Needs a valid OTP check before this step.
 */
otpRouter.post('/reset-password', (req, res, next) => {
    otpController.resetPassword(req, res, next);
});

export default otpRouter;