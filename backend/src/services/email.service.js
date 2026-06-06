

import nodemailer from "nodemailer";
import config from "../config/config.js";


const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: 2525,
    secure: false,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    },
    connectionTimeout: 15000,
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Mini Social App" <${config.SENDER_EMAIL}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("EMAIL SENT SUCCESSFULLY");
        console.log(info);

        return info;
    } catch (error) {
        console.error("EMAIL FAILED");
        console.error(error);
        throw error;
    }
};