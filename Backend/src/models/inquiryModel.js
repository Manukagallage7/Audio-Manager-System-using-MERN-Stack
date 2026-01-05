import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    response: {
        type: String,
        required: true,
        default: "Pending"
    },
    isResolved: {
        type: Boolean,
        required: true,
        default: false
    }
})

const inquiryModel = mongoose.model('Inquiry', inquirySchema)

export default inquiryModel;
    