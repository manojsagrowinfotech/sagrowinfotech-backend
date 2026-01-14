import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_API_DOMAIN =
  process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.in";
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
    console.error(
      "Error getting Zoho access token:",
      err.response?.data || err.message
    );
    throw new Error("Unable to get Zoho access token");
  }
}

// Send Email via Zoho
async function sendEmail({ to, subject, html }) {
  const accessToken = await getAccessToken();

  const emailData = {
    fromAddress: process.env.ZOHO_FROM_EMAIL,
    toAddress: to,
    subject,
    content: html,
    contentType: "html",
  };

  try {
    const response = await axios.post(
      `${process.env.ZOHO_API_DOMAIN}/mail/v1/messages`,
      emailData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Email sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("Zoho Email Error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    throw new Error("Unable to send email");
  }
}

// OTP Email Template
function forgotPasswordTemplate(name, otp) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background: #fff;
        border-radius: 8px;
        padding: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      h1 {
        font-size: 22px;
        color: #1d4ed8;
        text-align: center;
        margin-bottom: 20px;
      }
      p {
        font-size: 14px;
        color: #374151;
        line-height: 1.6;
      }
      .otp-box {
        text-align: center;
        margin: 25px 0;
      }
      .otp {
        display: inline-block;
        padding: 14px 26px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        background: #f0f7ff;
        color: #1d4ed8;
        border-radius: 6px;
        border: 1px dashed #93c5fd;
      }
      .note {
        background: #f9fafb;
        border-left: 4px solid #2563eb;
        padding: 12px;
        margin-top: 20px;
        font-size: 13px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
      @media only screen and (max-width: 600px) {
        .container { padding: 20px; margin: 20px; }
        .otp { font-size: 24px; padding: 12px 20px; letter-spacing: 4px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>OTP Verification</h1>
      <p>Hello <strong>${name || "User"}</strong>,</p>
      <p>We received a request to reset your account password. Use the OTP below to continue:</p>
      <div class="otp-box"><div class="otp">${otp}</div></div>
      <p>This OTP is valid for <strong>${process.env.OTP_EXPIRY_MIN || 5} minutes</strong>. Do not share this code with anyone.</p>
      <div class="note">If you did not request this, you can safely ignore this email. Your account remains secure.</div>
      <div class="footer">© ${new Date().getFullYear()} Sagrow Infotech. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;
}

export { sendEmail, forgotPasswordTemplate };
