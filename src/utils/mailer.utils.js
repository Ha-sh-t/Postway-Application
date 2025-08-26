import { oAuth2Client } from "../config/mailer.config.js";
import nodemailer from "nodemailer";

/**
 * Send an email using Gmail OAuth2
 */
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    // fetch access token safely
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken =
      typeof accessTokenResponse === "string"
        ? accessTokenResponse
        : accessTokenResponse?.token;

    // transporter config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // email structure
    const mailOptions = {
      from: `${process.env.APP_NAME || "Support Team"} <${process.env.USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    // send email
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

/**
 * Build OTP HTML email
 */
export function buildHtml(name, otp) {
  return `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#333">
      <p>Dear ${name},</p>
      <p>Your password-reset OTP is:
         <strong style="font-size:18px">${otp}</strong></p>
      <p>This OTP is valid for <strong>5 minutes</strong>. 
         Do not share it with anyone.</p>
      <p>Regards,<br><strong>${process.env.APP_NAME || "Your App Team"}</strong></p>
      <hr>
      <p style="font-size:12px;color:#888">
         This is an automated email, please do not reply.
      </p>
    </div>
  `;
}