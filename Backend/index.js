import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './src/routes/userRouter.js';
import productRouter from './src/routes/productRouter.js';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

let app = express();

app.use(bodyParser.json())
app.use((req, res, next)=> {
    const token = req.header("Authorization")
    if(token!== null){
        token = token.replace("Bearer", "")

        jwt.verify(token, "Audio-Manager-123",(err, decoded)=> {
            if(!err){
                req.user = decoded

            }
        })
    }
    next()
})

const mongoUrl = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/audio-manager';

mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message || err);
        process.exit(1);
    });

let connection = mongoose.connection;

app.use("/api/users", userRouter);
app.use("api/product", productRouter)

app.listen(5000, ()=> {
        console.log("Server is running on port 5000");
})


