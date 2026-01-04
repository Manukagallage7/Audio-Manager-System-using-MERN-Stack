import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export async function registerUser(req, res) {

    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10)

        const newUser = new User(req.body)
        const user = await newUser.save()

        return res.status(201).json({ message: 'User registered successfully', user })
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user', error })
    }
}

export async function loginUser(req,res) {
    try {
        const data = req.body;

        const user = await User.findOne({ email : data.email })
        if (user && bcrypt.compareSync(data.password, user.password)) {
            const token = jwt.sign({
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                type  : user.type,
                profilePicture: user.profilePicture
            }, process.env.JWT_SECRET)

            return res.status(200).json({ message: 'Login successful', token, user })
        }

        return res.status(401).json({ message: 'Invalid email or password' })
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error })
    }
}
