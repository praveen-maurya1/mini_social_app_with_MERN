import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/auth.middleware.js';
import postRouter from './routes/post.routes.js';
import cors from 'cors';

const app = express();

// app.use(cors());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

export default app;