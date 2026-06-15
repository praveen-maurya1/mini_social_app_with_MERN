import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST is not defined');
}

if (!process.env.SMTP_USER) {
    throw new Error('SMTP_USER is not defined');
}

if (!process.env.SMTP_PASS) {
    throw new Error('SMTP_PASS is not defined');
}
// if (!process.env.VITE_UPLOAD_PRESET) {
//     throw new Error('VITE_UPLOAD_PRESET is not defined');
// }
// if (!process.env.VITE_CLOUD_NAME) {
//     throw new Error('VITE_CLOUD_NAME is not defined');
// }




const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    // VITE_UPLOAD_PRESET: process.env.VITE_UPLOAD_PRESET,
    // VITE_CLOUD_NAME: process.env.VITE_CLOUD_NAME
};

export default config;