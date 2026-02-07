import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import nodemailer from 'nodemailer';

dotenv.config();

const transport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

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
            // Check if user is blocked
            if (user.blocked) {
                return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' })
            }

            const token = jwt.sign({
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                type  : user.type,
                phoneNumber : user.phoneNumber,
                profilePicture: user.profilePicture,
                blocked: user.blocked,
                emailVerified: user.emailVerified
            }, process.env.JWT_SECRET)

            return res.status(200).json(
                {
                    message: 'Login successful',
                    token,
                    user
                }
            )
        }

        return res.status(401).json({ message: 'Invalid email or password' })
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error })
    }
}

export async function getAllUsers(req, res) {
    try {
        if(!isAdmin(req)) {
            return res.status(403).json({ message: 'Unauthorized access. Admin access required.', userType: req.user?.type })
        }
        const users = await User.find({})
        return res.status(200).json({ users })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error })
    }
}

export async function blockUser(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Unauthorized access' })
        }

        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Admin cannot block another admin
        if (user.type === 'admin') {
            return res.status(403).json({ message: 'Cannot block an admin user' })
        }

        user.blocked = true;
        await user.save();

        return res.status(200).json({ message: 'User blocked successfully', user })
    } catch (error) {
        return res.status(500).json({ message: 'Error blocking user', error })
    }
}

export async function unblockUser(req, res) {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Unauthorized access' })
        }

        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        user.blocked = false;
        await user.save();

        return res.status(200).json({ message: 'User unblocked successfully', user })
    } catch (error) {
        return res.status(500).json({ message: 'Error unblocking user', error })
    }
}

export async function googleLogin(req, res) {
    const accessToken = req.body.accessToken
    console.log(accessToken)

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        console.log(response.data)

        const user = await User.findOne({
            email: response.data.email,
        })

        if(user != null) {
            const token = jwt.sign({
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                type  : user.type,
                phoneNumber : user.phoneNumber,
                profilePicture: user.profilePicture,
                blocked: user.blocked,
                emailVerified: user.emailVerified
            }, process.env.JWT_SECRET)

            res.json({ message: 'Google login successful', user: user, token: token })
        } else {
            const newUser = new User({
                email: response.data.email,
                password: bcrypt.hashSync(response.data.sub, 10),
                isBlocked: false,
                role: 'customer',
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                address: "Not Given",
                phoneNumber: "Not Given",
                profilePicture: response.data.picture,
                emailVerified: response.data.email_verified
            })
            const savedUser = await newUser.save();
            const token = jwt.sign({
                firstName : savedUser.firstName,
                lastName : savedUser.lastName,
                email : savedUser.email,
                type  : savedUser.type,
                phoneNumber : savedUser.phoneNumber,
                profilePicture: savedUser.profilePicture,
                blocked: savedUser.blocked,
                emailVerified: savedUser.emailVerified
        },
            process.env.JWT_SECRET
        )

            return res.status(200).json({ message: 'Google login successful',token: token, user: savedUser });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error during Google login', error });
    }
}

export async function sendOTP(req, res){

    if(req.user == null) {
        res.status(401).json({ message: 'Unauthorized access' })
        return;
    }
    const message = {
        from : process.env.EMAIL_USER,
        to : req.body.email,
        subject : 'Password Reset OTP',
        text : `Your OTP for password reset is: ${req.body.otp}`
    }

    try {
        await transport.sendMail(message);
        console.log('Email sent successfully');
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending OTP', error });
    }
}

export function isCustomer(req) {
    return !!(req && req.user && req.user.type === "customer")
}

export function isAdmin(req) {
    return !!(req && req.user && req.user.type === "admin")
}