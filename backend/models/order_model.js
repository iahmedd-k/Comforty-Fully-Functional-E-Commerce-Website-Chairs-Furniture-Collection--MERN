import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "ComfortyUser", required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "ComfortyProduct", required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    shippingAddress: {
        address: String,
        city: String,
        postalCode: String,
        country: String
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "pending" },
    orderStatus: { type: String, default: "processing" },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
