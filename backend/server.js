import dotenv from "dotenv"
dotenv.config();

import express from "express"
import cors from "cors"
import user_routes from "./routes/user_routes.js"
import order_routes from "./routes/order_routes.js"
import product_routes from "./routes/product_routes.js"
import cartRoutes from "./routes/cart_routes.js"
import adminRoutes from "./routes/admin_routes.js"
import stripeRoutes from './routes/stripe_routes.js';
import dbconnect from "./config/db.js";
import { sendEmail } from "./util/sendemail.js";
const app = express()
app.use("/api/stripe", stripeRoutes);


app.use(cors());
app.use(express.json());


app.use('/api/user', user_routes)

app.use('/api/orders', order_routes)
app.use('/api/products', product_routes)
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

dbconnect();
const PORT = 5000


 sendEmail({
    to: "liveinfoak@gmail.com",
    subject: "Welcome to Comforty!",
    html: `<h2>Hello ,</h2><p>Your account was created successfully!</p>`
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));