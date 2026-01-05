import inquiryModel from '../models/inquiryModel.js';
import { isAdmin, isCustomer } from './userController.js';

export async function createInquiry(req, res) {

    try {
        if (isCustomer(req)) {
            const data = req.body;
            data.email = req.user.email
            data.phoneNumber = req.user.phoneNumber
            let id = 0
            const inquiries = await inquiryModel.find().sort({id: -1}).limit(1);
            
            if(inquiries.length === 0) {
                id = 1
            } else {
                id = inquiries[0].id + 1
            }
            data.id = id;

            const newInquiry = new inquiryModel(data);
            await newInquiry.save();
            res.status(201).json(
                {
                    message: 'Inquiry created successfully',
                    inquiry: newInquiry
                }
            );
            return;
        } else {
            res.status(403).json(
                {
                    message: 'You are Unauthorized access'
                }
            );
            return;
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error creating inquiry',
            error: err
        });
    }
}

export async function getInquiries(req, res) {

    try {
        if (isCustomer(req)) {
            const inquiries = await inquiryModel.find({
                email: req.user.email
            });
            res.status(200).json(
                {
                    message: 'Inquiries fetched successfully',
                    inquiries
                }
            );
            return;
        } else if(isAdmin(req)) {
            const inquiries = await inquiryModel.find();
            res.status(200).json(
                {
                    message: 'Inquiries fetched successfully',
                    inquiries
                }
            );
            return;
        } else {
            res.status(403).json(
                {
                    message: 'You are Unauthorized access'
                }
            );
            return;
        }
        } catch (err) {
            res.status(500).json(
                {
                    message: 'Error fetching inquiries',
                    error: err
                }
            );
        }
    }

export async function updateInquiry(req, res) {
    try{
        if(isAdmin(req)) {
            const inquiryId = req.params.id;
            const data = req.body;

            const updatedInquiry = await inquiryModel.findOneAndUpdate(
                { id: inquiryId },
                { $set: data },
                { new: true }
            );

            res.json({
                message: 'Inquiry updated successfully',
                inquiry: updatedInquiry
            });
        } else if(isCustomer(req)) {
            const inquiryId = req.params.id
            const data = req.body
            const inquiry = await inquiryModel.findOne({ id: inquiryId })
            
            if(inquiry == null) {
                res.status(403).json(
                    {
                        message: 'Inquiry not found'
                    }
                )
                return
            } else {
                if(inquiry.email == req.user.email) {
                    const updatedInquiry = await inquiryModel.findOneAndUpdate(
                        { id: inquiryId },
                        { $set: { message: data.message } },
                        { new: true }
                    );

                    res.json({
                        message: 'Inquiry updated successfully',
                        inquiry: updatedInquiry
                    });
                } else {
                    res.status(403).json(
                        {
                            message: 'You are Unauthorized access'
                        }
                    )
                    return
                }
            }
        }
    } catch(err) {
        res.status(500).json(
            {
                message: 'Error updating inquiry',
                error: err
            }
        )
    }
}

export async function deleteInquiry(req, res) {
    try {
        if (isAdmin(req)) {
            const inquiryId = req.params.id;
            const deletedInquiry = await inquiryModel.findOneAndDelete({ id: inquiryId });
            
            res.status(200).json(
                {
                    message: 'Inquiry deleted successfully',
                    inquiry: deletedInquiry
                }
            );
            return;
        } else if(isCustomer(req)) {
            const inquiryId = req.params.id;
            const inquiry = await inquiryModel.findOneAndDelete({ id: inquiryId })

            if(inquiry == null) {
                res.status(403).json(
                    {
                        message: 'Inquiry not found'
                    }
                );
                return;
            } else {
                if(inquiry.email == req.user.email) {
                    await inquiryModel.findOneAndDelete({ id: inquiryId })
                    res.status(200).json(
                        {
                            message: 'Inquiry deleted successfully',
                            inquiry: inquiry
                        }
                    );
                    return;
                } else {
                    res.status(403).json(
                        {
                            message: 'You are Unauthorized access'
                        }
                    );
                    return;
                }
            }
        } else {
            res.status(403).json(
                {
                    message: 'You are Unauthorized access'
                }
            );
            return;
        }
    } catch (err) {
        res.status(500).json(
            {
                message: 'Error deleting inquiry',
                error: err
            }
        );
    }
}
