import express from 'express';
import { registerUser, loginUser, getAllUsers, blockUser, unblockUser, sendOTP, verifyOTP, googleLogin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/users', getAllUsers);
userRouter.put('/users/block/:email', blockUser);
userRouter.put('/users/unblock/:email', unblockUser);
userRouter.post('/google-login', googleLogin)
userRouter.post('/send-otp', sendOTP);
userRouter.post('/verify-otp', verifyOTP);


export default userRouter;