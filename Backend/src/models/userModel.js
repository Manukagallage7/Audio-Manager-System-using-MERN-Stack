import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        default: 'customer'
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false,
        default: ""
    },
    phoneNumber: {
        type: String,
        required: false,
        default: ""
    },
    profilePicture: {
        type: String,
        required: false,
        default: ""
    },
    emailVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    blocked: {
        type: Boolean,
        required: false,
        default: false
    }
})

const User = mongoose.model('User', userSchema);

export default User;