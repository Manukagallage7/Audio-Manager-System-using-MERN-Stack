import express from 'express';
import { createInquiry, deleteInquiry, getInquiries, updateInquiry } from '../controllers/inquiryController.js';

const inquiryRouter = express.Router();

inquiryRouter.post("/", createInquiry)
inquiryRouter.get("/", getInquiries)
inquiryRouter.delete("/:id", deleteInquiry)
inquiryRouter.put("/:id", updateInquiry)

export default inquiryRouter;