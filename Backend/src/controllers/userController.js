import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export function registerUser(req, res) {

    req.body.password = bcrypt.hashSync(req.body.password, 10)

    const newUser = new User(req.body)

    newUser.save()
        .then(user => {
            res.status(201).json(
                {
                    message: 'User registered successfully', user
                });
        })
        .catch(error => {
            res.status(500).json(
                {
                    message: 'Error registering user', error
                });
        });
}

export function loginUser(req,res) {

    const data = req.body;

    User.findOne({ email : data.email })
        .then(user => {
            if(user && bcrypt.compareSync(data.password, user.password)) {
                const token = jwt.sign({
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email,
                    role  : user.role
                }, process.env.JWT_SECRET)
                res.status(200).json(
                    {
                        message: 'Login successful',
                        token: token,
                        user
                    });
            } else {
                res.status(401).json(
                    {
                        message: 'Invalid email or password'
                    });
            }
        })
        .catch(error => {
            res.status(500).json(
                {
                    message: 'Error logging in', error
                });
        }

        )
}

export function updateUser(req,res) {
    
}