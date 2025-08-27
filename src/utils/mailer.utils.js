
/**
 * Send an email using Gmail OAuth2
 */
import nodemailer from "nodemailer";
import { oAuth2Client } from "../config/mailer.config.js";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    // get new token from Google
    const accessTokenObj = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenObj?.token;

    // transporter config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,       // full Gmail address
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });

    // email structure
    const mailOptions = {
      from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
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