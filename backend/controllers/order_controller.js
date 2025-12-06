import Order from "../models/order_model.js";
import { Product } from "../models/product_model.js";
import { Cart } from "../models/cart_model.js";


export const checkout = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalPrice = 0;
        const orderProducts = [];

        for (const item of cart.items) {
            const product = item.product;

            if (!product || !product.isAvailable) {
                return res.status(400).json({ message: `${item.product.name} is not available` });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalPrice += product.price * item.quantity;
        }

        // ▣ 1. Create a PENDING order
        const order = await Order.create({
            user: req.user._id,
            products: orderProducts,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            orderStatus: "pending"
        });

        // ▣ 2. Create Stripe PaymentIntent
       const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: "usd",
            metadata: {
                orderId: order._id.toString(),
                userId: req.user._id.toString()
            },
            receipt_email: req.user.email
        });



        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            orderId: order._id
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("products.product", "name price images slug");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("products.product", "name price images slug");

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus, paymentStatus },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order updated", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product", "name price slug");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
