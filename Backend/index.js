import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './src/routes/userRouter.js';
import 'dotenv/config';

let app = express();

app.use(bodyParser.json())

const mongoUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/audio-manager';

mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message || err);
        process.exit(1);
    });

let connection = mongoose.connection;

app.use("/api/users", userRouter);

app.listen(5000, ()=> {
        console.log("Server is running on port 5000");
})


