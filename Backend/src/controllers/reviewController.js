import reviewModel from "../models/reviewModel.js";

export async function addReview(req,res) {

    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    const data = req.body

    data.name = req.user.firstName + " " + req.user.lastName
    data.profilePicture = req.user.profilePicture
    data.email = req.user.email

    if (data.rating == null || data.comment == null) {
        return res.status(400).json({ message: "rating and comment are required" });
    }

    const newReview = new reviewModel(data)

    try {
        await newReview.save()
        res.status(201).json({ message: "Review added successfully" })
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: "Review addition failed"
        })
    }

}

export async function getReviews(req,res) {
    const user = req.user

    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }

    try{
        if (req.user.type === "admin") {
            const reviews = await reviewModel.find()
            res.status(200).json(reviews)
        } else {
            const reviews = await reviewModel.find({
                isApproved: true
            })
            res.json(reviews)
        }
    }catch(err) {
        res.status(500).json({
            error: "Review loading failed"
        })
        
    }
}

export async function updateReview(req,res) {
    const email = req.params.email

    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }
    const update = req.body || {};

    // Admin can update any review
    if (req.user.type === "admin") {
        try {
            const reviews = await reviewModel.updateOne({ email }, { $set: update })
            return res.json({ message: "Review updated successfully", review: reviews })
        } catch (err) {
            return res.status(500).json({ error: "Review update failed" })
        }
    }

    // Customer can update only their own review
    if (req.user.type === "customer") {
        if (req.user.email !== email) {
            return res.status(403).json({ message: "Not authorized to update this review" });
        }
        try {
            const reviews = await reviewModel.updateOne({ email }, { $set: update })
            return res.json({ message: "Review updated successfully", review: reviews })
        } catch (err) {
            return res.status(500).json({ error: "Review update failed" })
        }
    }

    return res.status(403).json({ message: "Not authorized" });

}

export async function deleteReview(req,res) {
    const email = req.params.email

    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }
    // Admin can delete any review
    if(req.user.type == "admin"){
        try {
            await reviewModel.deleteOne({ email: email })
            res.json({ message: "Review deleted successfully" })
        } catch (err) {
            res.status(500).json({ error: "Review deletion failed" })
        }
        return
    }

    // Customer can delete only their own review
    if(req.user.type == "customer") {
        if(req.user.email == email) {
            try {
                await reviewModel.deleteOne({ email: email })
                res.json({ message: "Review deleted successfully" })
            } catch (err) {
                res.status(500).json({ error: "Review deletion failed" })
            }
        }
    }
}

export async function approveReview(req,res) {
    const email = req.params.email

    if(req.user == null || req.user.type !== "admin"){
        res.status(401).json({
            message: "Please login as admin & try again"
        })
        return
    }

    try {
        await reviewModel.updateOne({ email: email }, { isApproved: true })
        res.json({ message: "Review approved successfully" })
    } catch (err) {
        res.status(500).json({ error: "Review approval failed" })
    }
}