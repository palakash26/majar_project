const nodemailer = require("nodemailer");

async function sendMail({ to, subject, body, html }) {
  try {
    let transporter;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Automatic real-time sandbox test account
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `"Wanderlust Real-Time Concierge" <${process.env.EMAIL_USER || "concierge@wanderlust.com"}>`,
      to: to,
      subject: subject,
      text: body,
      html: html || `<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #fe424d; font-size: 26px; margin: 0;">Wanderlust</h2>
          <p style="color: #666; font-size: 14px; margin-top: 5px;">Real-Time Traveler Communication</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0; font-size: 18px;">${subject}</h3>
          <p style="font-size: 15px; color: #444; line-height: 1.6; whitespace: pre-wrap;">${body.replace(/\n/g, '<br>')}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #999; margin: 0;">
          Sent automatically via Wanderlust Real-Time Dispatch System
        </p>
      </div>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`✉️ [Mail Service] Real-time email dispatched to ${to}. MessageId: ${info.messageId}`);
    if (previewUrl) {
      console.log(`🔗 [Mail Preview URL]: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error("❌ [Mail Service Error]:", err);
    throw err;
  }
}

module.exports = sendMail;
