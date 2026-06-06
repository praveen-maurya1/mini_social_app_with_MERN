
import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
    },
});

export const sendEmail = async (to, subject, text, html) => {
    const info = await transporter.sendMail({
        from: `Mini Social App <${config.SENDER_EMAIL}>`,
        to,
        subject,
        text,
        html,
    });

    console.log("Email sent:", info.messageId);
};

console.log("SMTP_HOST:", config.SMTP_HOST);
console.log("SMTP_PORT:", config.SMTP_PORT);
console.log("SMTP_USER:", config.SMTP_USER);