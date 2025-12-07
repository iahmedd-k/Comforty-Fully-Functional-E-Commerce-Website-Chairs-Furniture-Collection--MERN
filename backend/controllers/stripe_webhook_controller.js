import stripe  from "../config/stripe.js";
import Order from "../models/order_model.js";
import { Product } from "../models/product_model.js";
import {Cart} from "../models/cart_model.js";
import { sendEmail } from "../util/sendemail.js";

export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const sig = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object;
        const orderId = intent.metadata.orderId;

        const order = await Order.findById(orderId).populate("products.product");

        if (!order) return res.status(404).send("Order not found");

        order.paymentStatus = "paid";
        order.orderStatus = "processing";
        await order.save();

        for (const item of order.products) {
            const product = await Product.findById(item.product._id);
            product.stock -= item.quantity;
            if (product.stock <= 0) product.isAvailable = false;
            await product.save();
        }

        await Cart.findOneAndUpdate(
            { user: order.user },
            { items: [] }
        );


          await sendEmail({
            to: user.email,
            subject: "Your Order is Confirmed!",
            html: orderConfirmedTemplate(user, order)
        });
    }
    if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    const orderId = intent.metadata.orderId;

    const order = await Order.findById(orderId);
    const user = await User.findById(order.user);

    await sendEmail({
        to: user.email,
        subject: "Payment Failed",
        html: `<p>Your payment for order <b>${orderId}</b> failed. Please try again.</p>`
    });
}


    res.json({ received: true });
};
