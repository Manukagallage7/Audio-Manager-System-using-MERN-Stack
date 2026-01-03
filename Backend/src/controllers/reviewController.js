import reviewModel from "../models/reviewModel.js";

export function addReview(req,res) {

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

    newReview.save()
    .then(()=> {
        res.status(201).json({
            message: "Review added successfully"
        })
    })
    .catch((err)=> {
        res.status(500).json({
            message: err.message || err,
            error: "Review addition failed"
        })
    })

}

export function getReviews(req,res) {
    const user = req.user
    if(user == null || user.type !== "admin") {
        reviewModel.find({
            isApproved: true
        })
        .then((reviews)=> {
            res.json(reviews)
        })
        return
    }

    if(user.type == "admin") {
        reviewModel.find()
        .then((reviews)=> {
            res.json(reviews)
        })
    }
}

export function updateReview(req,res) {
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
        return reviewModel.updateOne({ email }, { $set: update })
            .then(() =>
                res.json(
                    { message: "Review updated successfully" }
                ))
            .catch((err) =>
                res.status(500).json(
                    { error: "Review updating failed", details: err.message }
                ));
    }

    // Customer can update only their own review
    if (req.user.type === "customer") {
        if (req.user.email !== email) {
            return res.status(403).json({ message: "Not authorized to update this review" });
        }
        return reviewModel.updateOne({ email }, { $set: update })
            .then(() =>
                res.json(
                    { message: "Review updated successfully" }
                ))
            .catch((err) =>
                res.status(500).json(
                    { error: "Review updating failed", details: err.message }
                ));
    }

    return res.status(403).json({ message: "Not authorized" });
}

export function deleteReview(req,res) {
    const email = req.params.email

    if(req.user == null){
        res.status(401).json({
            message: "Please login & try again"
        })
        return
    }
    // Admin can delete any review
    if(req.user.type == "admin"){
        reviewModel.deleteOne({
        email: email
    }).then(()=>{
        res.json({
            message: "Review deleted successfully"
        })
    }).catch(()=> {
        res.status(500).json({
            error: "Review deletion failed"
        })
    })
    return
    }

    // Customer can delete only their own review
    if(req.user.type == "customer") {
        if(req.user.email == email) {
            reviewModel.deleteOne({
                email: email
            }).then(()=>{
                res.json({
                    message: "Review deleted successfully"
                })
            }).catch(()=> {
                res.status(500).json({
                    error: "Review deletion failed"
                })
            })
        }
    }
}

export function approveReview(req,res) {
    const email = req.params.email

    if(req.user == null || req.user.type !== "admin"){
        res.status(401).json({
            message: "Please login as admin & try again"
        })
        return
    }

    reviewModel.updateOne(
        {
            email: email
        },
        {
            isApproved: true
        }
    ).then(()=>{
        res.json({
            message: "Review approved successfully"
        })
    }).catch(()=> {
        res.status(500).json({
            error: "Review approval failed"
        })
    })
}