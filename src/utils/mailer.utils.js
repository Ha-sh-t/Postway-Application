import { oAuth2Client } from "../config/mailer.config.js";
import nodemailer from 'nodemailer'
export const sendEmail = async (to , subject , htmlContent)=>{
    try{
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport(
        {
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:process.env.USER,
                clientId:process.env.CLIENT_ID,
                clientSecret:process.env.CLIENT_SECRET,
                refreshToken:process.env.REFRESH_TOKEN,
                accessToken:accessToken.token
            }
        }
    );

    const mailOptions = {
        from:`Support Team <${process.env.USER}>`,
        to:to,
        subject:subject,
        html:htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:",result.messageId)
    return result;
    }
    catch(error){
        console.log("Failed to send email",error)
        throw error;
    }

}

export function buildHtml(name, otp) {
  return `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#333">
      <p>Dear ${name},</p>
      <p>This is your password-reset OTP: 
         <strong style="font-size:18px">${otp}</strong></p>
      <p>The OTP is valid for <strong>5&nbsp;minutes</strong>. 
         Do not share it with anyone.</p>
      <p>Regards,<br><strong>Your&nbsp;App&nbsp;Team</strong></p>
      <hr>
      <p style="font-size:12px;color:#888">
         This is an automated email, please do not reply.
      </p>
    </div>
  `;
}
