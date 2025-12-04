import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "ComfortyUser", required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "ComfortyProduct", required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
}, { timestamps: true });

export const Cart = mongoose.model("Cart", cartSchema);
