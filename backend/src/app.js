import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/auth.middleware.js';
import postRouter from './routes/post.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import followRouter from "./routes/follow.routes.js";
import conversationRouter from "./routes/conversation.routes.js";
import messageRouter from "./routes/message.routes.js";


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.use("/api/follows", followRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

export default app;