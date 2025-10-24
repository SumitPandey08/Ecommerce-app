import Order from '../models/order.model';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';


export const createOrder = asyncHandler(async (req, res) => {
    const { cartItems, shippingAddress, paymentMethod } = req.body;
    if (!cartItems || cartItems.length === 0) {
        res.status(400);
        throw new Error('No items in the cart');
    }
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    let totalPrice = 0;
    for (const item of cartItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.productId}`);
        }
        totalPrice += product.price * item.quantity;
    }
    const order = new Order({
        user: user._id,
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: false,
        isDelivered: false,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'username email');
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }
    if (order.user._id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }
    res.json(order);
});
