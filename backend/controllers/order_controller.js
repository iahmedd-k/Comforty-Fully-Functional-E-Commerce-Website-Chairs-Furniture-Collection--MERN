import Order from "../models/order_model.js";
import { Product } from "../models/product_model.js";
import { Cart } from "../models/cart_model.js";
export const checkout = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // 1️⃣ Get the user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalPrice = 0;
        const orderProducts = [];

        // 2️⃣ Validate stock & calculate total price
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);

            if (!product || !product.isAvailable) {
                return res.status(400).json({ message: `${item.product.name} is not available` });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
            }

            // 3️⃣ Prepare product details for order
            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalPrice += product.price * item.quantity;
        }

        // 4️⃣ Create the order
        const order = await Order.create({
            user: req.user._id,
            products: orderProducts,
            shippingAddress,
            paymentMethod,
            totalPrice
        });

        // 5️⃣ Deduct stock from products
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            if (product.stock === 0) product.isAvailable = false;
            await product.save();
        }

        // 6️⃣ Clear the cart
        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Order created successfully", order });
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
