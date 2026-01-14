import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_API_DOMAIN = process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.in";
const ZOHO_FROM_EMAIL = process.env.ZOHO_FROM_EMAIL;

// Get Access Token
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      null,
      {
        params: {
          refresh_token: ZOHO_REFRESH_TOKEN,
          client_id: ZOHO_CLIENT_ID,
          client_secret: ZOHO_CLIENT_SECRET,
          grant_type: "refresh_token",
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Error getting Zoho access token:", err.response?.data || err.message);
    throw new Error("Unable to get Zoho access token");
  }
}

// Send Email via Zoho
async function sendEmail({ to, subject, html }) {
  const accessToken = await getAccessToken();

  const emailData = {
    fromAddress: ZOHO_FROM_EMAIL,
    toAddress: to,
    subject,
    content: html,
  };

  try {
    const response = await axios.post(`${ZOHO_API_DOMAIN}/mail/v1/messages`, emailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Email sent successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error sending email via Zoho:", err.response?.data || err.message);
    throw new Error("Unable to send email");
  }
}

// OTP Email Template
function forgotPasswordTemplate(name, otp) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
    <style>
      body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif; }
      .wrapper { width: 100%; padding: 30px 0; }
      .container { max-width: 520px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      .content { color: #374151; font-size: 14px; line-height: 1.6; }
      .otp-box { margin: 25px 0; text-align: center; }
      .otp { display: inline-block; padding: 14px 26px; font-size: 28px; font-weight: bold; letter-spacing: 6px; background: #f0f7ff; color: #1d4ed8; border-radius: 8px; border: 1px dashed #93c5fd; }
      .note { background: #f9fafb; border-left: 4px solid #2563eb; padding: 12px; margin-top: 20px; font-size: 13px; }
      .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="content">
          <p>Hello <strong>${name || "User"}</strong>,</p>
          <p>We received a request to reset your account password. Please use the One-Time Password (OTP) below to continue.</p>
          <div class="otp-box"><div class="otp">${otp}</div></div>
          <p>This OTP is valid for <strong>${process.env.OTP_EXPIRY_MIN || 5} minutes</strong>. Do not share this code with anyone.</p>
          <div class="note">If you did not request this, you can safely ignore this email. Your account remains secure.</div>
        </div>
        <div class="footer">© ${new Date().getFullYear()} Sagrow Infotech. All rights reserved.</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

export { sendEmail, forgotPasswordTemplate };