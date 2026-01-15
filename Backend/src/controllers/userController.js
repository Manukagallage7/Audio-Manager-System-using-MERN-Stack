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
                blocked: user.blocked
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

export function isCustomer(req) {
    return !!(req && req.user && req.user.type === "customer")
}

export function isAdmin(req) {
    return !!(req && req.user && req.user.type === "admin")
}