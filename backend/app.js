import express from "express";
import dotenv from 'dotenv';
import { db } from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import spareRoutes from './routes/spareRoutes.js';
import spareInRoutes from './routes/spareInRoutes.js';
import session from "express-session";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(session({
    name: "sid",
    secret: "PRINCE1234SECRETKEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}))

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello World!"
    })
})

app.use('/auth', authRoutes);
app.use('/spareparts', spareRoutes);
app.use('/spareIn', spareInRoutes);

app.listen(port, () => {
    console.log("App running on port", port)
})