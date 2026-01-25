import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { isAdmin } from './userController.js';

export async function createOrder(req, res) {
    const data = req.body
    const orderInfo = {
        orderItems: []
    }
    if(req.user == null ){
        res.status(401).json(
            {
                message: 'Unauthorized: User not logged in'
            }
        );
        return;
    }
    orderInfo.email = req.user.email;

    const lastOrder = await Order.findOne().sort({orderId: -1}).limit(1);
    if (lastOrder) {
        const lastOrderNumber = parseInt(lastOrder.orderId.replace('ORD', ''));
        orderInfo.orderId = 'ORD' + String(lastOrderNumber + 1).padStart(5, '0');
    } else {
        orderInfo.orderId = 'ORD00001';
    }

    let oneDayCost = 0;

    for(let i=0; i<data.orderItems.length; i++){
        try {
            const product = await Product.findOne({
                key: data.orderItems[i].productKey
            })
            if(product == null) {
                res.status(404).json({
                    message: `Product with key ${data.orderItems[i].productKey} not found`
                });
                return;
            }

            if(product.availability == false) {
                res.status(404).json({
                    message: `Product with key ${data.orderItems[i].productKey} is not available`
                });
                return;
            }

            orderInfo.orderItems.push({
                product: {
                    key: product.key,
                    name: product.name,
                    price: product.price,
                    image: product.image[0]
                },
                quantity: data.orderItems[i].quantity
            })

            oneDayCost += product.price * data.orderItems[i].quantity;

            
        } catch(error) {
            res.status(500).json(
                {
                    message: 'Error creating order',
                    error
                }
            );
            return;
        }
    }

    orderInfo.days = data.days
    orderInfo.startingDate = data.startingDate
    orderInfo.endingDate = data.endingDate
    orderInfo.totalAmount = oneDayCost * data.days

    const newOrder = new Order(orderInfo);

    try {
        await newOrder.save();
        res.status(201).json(
            {
                message: 'Order created successfully',
                order: newOrder
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                message: 'Error creating order',
                error
            }
        );
    }
}

export function getOrders(req, res) {
    if(req.user == null ){
        res.status(401).json(
            {
                message: 'Unauthorized: User not logged in'
            }
        );
        return;
    }

    try {
        if(isAdmin(req)) {
            Order.find({})
            .then(orders => {
                res.status(200).json(
                    {
                        message: 'Orders fetched successfully',
                        orders
                    }
                )
            })
            .catch(err => {
                res.status(500).json(
                    {
                        message: 'Error fetching orders',
                        err
                    }
                )
            })
        } else {
            Order.find({ email: req.user.email })
            .then(orders => {
                res.status(200).json(
                    {
                        message: 'Orders fetched successfully',
                        orders
                    }
                )
            })
            .catch(err => {
                res.status(500).json(
                    {
                        message: 'Error fetching orders',
                        err
                    }
                )
            })
        }
    } catch (err) {
        res.status(500).json(
            {
                message: 'Error fetching orders',
                err
            }
        );
    }
}

export async function approveOrder(req, res) {
    if (req.user == null) {
        return res.status(401).json({
            message: 'Unauthorized: User not logged in'
        });
    }

    if (!isAdmin(req)) {
        return res.status(403).json({
            message: 'Forbidden: Only admins can approve orders'
        });
    }

    const { orderId } = req.params;

    try {
        const order = await Order.findOneAndUpdate(
            { orderId },
            { isApproved: true },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: `Order with ID ${orderId} not found`
            });
        }

        res.status(200).json({
            message: 'Order approved successfully',
            order
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error approving order',
            err
        });
    }
}

export async function rejectOrder(req, res) {
    if (req.user == null) {
        return res.status(401).json({
            message: 'Unauthorized: User not logged in'
        });
    }

    if (!isAdmin(req)) {
        return res.status(403).json({
            message: 'Forbidden: Only admins can reject orders'
        });
    }

    const { orderId } = req.params;

    try {
        const order = await Order.findOneAndUpdate(
            { orderId },
            { isRejected: true, isApproved: false },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: `Order with ID ${orderId} not found`
            });
        }

        res.status(200).json({
            message: 'Order rejected successfully',
            order
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error rejecting order',
            err
        });
    }
}

export async function deleteOrder(req, res) {
    if (req.user == null) {
        return res.status(401).json({
            message: 'Unauthorized: User not logged in'
        });
    }

    if (!isAdmin(req)) {
        return res.status(403).json({
            message: 'Forbidden: Only admins can delete orders'
        });
    }

    const { orderId } = req.params;

    try {
        const order = await Order.findOneAndDelete({ orderId });

        if (!order) {
            return res.status(404).json({
                message: `Order with ID ${orderId} not found`
            });
        }

        res.status(200).json({
            message: 'Order deleted successfully',
            order
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting order',
            err
        });
    }
}