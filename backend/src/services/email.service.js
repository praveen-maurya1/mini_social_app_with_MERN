// import nodemailer from 'nodemailer';
// import config from '../config/config.js';

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: config.GOOGLE_USER,
//         clientId: config.GOOGLE_CLIENT_ID,
//         clientSecret: config.GOOGLE_CLIENT_SECRET,
//         refreshToken: config.GOOGLE_REFRESH_TOKEN
//     }
// });

// // Verify the connection configuration
// transporter.verify((error, success) => {
//     if (error) {
//         console.error('Error connecting to email server:', error);
//     } else {
//         console.log('Email server is ready to send messages');
//     }
// });


// // Function to send email
// export const sendEmail = async (to, subject, text, html) => {
//     try {
//         const info = await transporter.sendMail({
//             from: `"Your Name" <${config.GOOGLE_USER}>`, // sender address
//             to, // list of receivers
//             subject, // Subject line
//             text, // plain text body
//             html, // html body
//         });

//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };


import nodemailer from "nodemailer";
import config from "../config/config.js";

// const transporter = nodemailer.createTransport({
//     host: config.SMTP_HOST,
//     port: 587,
//     secure: false,
//     auth: {
//         user: config.SMTP_USER,
//         pass: config.SMTP_PASS,
//     },
// });



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
// export const sendEmail = async (to, subject, text, html) => {
//     const info = await transporter.sendMail({
//         from: `Mini Social App <${config.SMTP_USER}>`,
//         to,
//         subject,
//         text,
//         html,
//     });

//     console.log("Email sent:", info.messageId);
// };

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
console.log("SMTP_HOST:", config.SMTP_HOST);
console.log("SMTP_PORT:", config.SMTP_PORT);
console.log("SMTP_USER:", config.SMTP_USER);