import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// if (!process.env.GOOGLE_CLIENT_ID) {
//     throw new Error('GOOGLE_CLIENT_ID is not defined in environment variables');
// }

// if (!process.env.GOOGLE_CLIENT_SECRET) {
//     throw new Error('GOOGLE_CLIENT_SECRET is not defined in environment variables');
// }

// if (!process.env.GOOGLE_REFRESH_TOKEN) {
//     throw new Error('GOOGLE_REFRESH_TOKEN is not defined in environment variables');
// }

// if (!process.env.GOOGLE_USER) {
//     throw new Error('GOOGLE_USER is not defined in environment variables');
// }

if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST is not defined');
}

if (!process.env.SMTP_USER) {
    throw new Error('SMTP_USER is not defined');
}

if (!process.env.SMTP_PASS) {
    throw new Error('SMTP_PASS is not defined');
}



const config = {
    // MONGO_URI: process.env.MONGO_URI,
    // JWT_SECRET: process.env.JWT_SECRET,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    // GOOGLE_USER: process.env.GOOGLE_USER
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,

    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SENDER_EMAIL: process.env.SENDER_EMAIL
};

export default config;