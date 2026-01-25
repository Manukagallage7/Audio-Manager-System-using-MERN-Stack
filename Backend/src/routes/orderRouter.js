import express from 'express';
import { createOrder, getOrders, approveOrder, rejectOrder, deleteOrder } from '../controllers/orderController.js';

const orderRouter = express.Router()

orderRouter.post('/create', createOrder)
orderRouter.get('/' ,getOrders)
orderRouter.put('/approve/:orderId', approveOrder)
orderRouter.put('/reject/:orderId', rejectOrder)
orderRouter.delete('/:orderId', deleteOrder)

export default orderRouter;