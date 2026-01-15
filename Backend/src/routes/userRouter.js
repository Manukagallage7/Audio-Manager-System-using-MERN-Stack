import express from 'express';
import { registerUser, loginUser, getAllUsers, blockUser, unblockUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/users', getAllUsers);
userRouter.put('/users/block/:email', blockUser);
userRouter.put('/users/unblock/:email', unblockUser);

export default userRouter;