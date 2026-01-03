import express from 'express';
import { addReview, approveReview, deleteReview, getReviews, updateReview } from '../controllers/reviewController.js'

const reviewRouter = express.Router()

reviewRouter.post("/", addReview)
reviewRouter.get("/", getReviews)
reviewRouter.put("/:email", updateReview)
reviewRouter.delete("/:email", deleteReview)
reviewRouter.put("/approve/:email", approveReview)

export default reviewRouter;