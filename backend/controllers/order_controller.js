import Order from "../models/order_model.js";
import { Product } from "../models/product_model.js";
import { Cart } from "../models/cart_model.js";
import stripe from "../config/stripe.js";


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

        // ▣ 1. Create order
        const order = await Order.create({
            user: req.user._id,
            products: orderProducts,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
            orderStatus: "pending"
        });

        // ▣ 2. Handle payment based on method
        if (paymentMethod === "cod") {
            // For COD, just return the order - no payment processing needed
            // Update stock and clear cart
            for (const item of orderProducts) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock -= item.quantity;
                    if (product.stock <= 0) product.isAvailable = false;
                    await product.save();
                }
            }

            // Clear cart
            cart.items = [];
            await cart.save();

            res.status(200).json({
                orderId: order._id,
                paymentMethod: "cod",
                message: "Order placed successfully. Payment will be collected on delivery."
            });
        } else if (paymentMethod === "card" || paymentMethod === "online") {
            // For online payment, create Stripe PaymentIntent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalPrice * 100),
                currency: "usd",
                metadata: {
                    orderId: order._id.toString(),
                    userId: req.user._id.toString()
                },
                receipt_email: req.user.email,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                orderId: order._id,
                paymentMethod: "card",
                message: "Payment intent created. Please confirm payment."
            });
        } else {
            return res.status(400).json({ message: "Invalid payment method" });
        }

    } catch (error) {
        console.error('[checkout] Error:', error);
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

// Confirm payment and update order (called after Stripe payment succeeds)
export const confirmPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId).populate("products.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update order status
        order.paymentStatus = "paid";
        order.orderStatus = "processing";
        await order.save();

        // Update stock
        for (const item of order.products) {
            const product = await Product.findById(item.product._id || item.product);
            if (product) {
                product.stock -= item.quantity;
                if (product.stock <= 0) product.isAvailable = false;
                await product.save();
            }
        }

        // Clear cart
        const cart = await Cart.findOne({ user: order.user });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({ 
            message: "Payment confirmed and order processed", 
            order 
        });
    } catch (error) {
        console.error('[confirmPayment] Error:', error);
        res.status(500).json({ message: error.message });
    }
};
