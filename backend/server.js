import express from "express"
import cors from "cors"
import user_routes from "./routes/user_routes.js"
import order_routes from "./routes/order_routes.js"
import product_routes from "./routes/product_routes.js"
import cartRoutes from "./routes/cart_routes.js"
import adminRoutes from "./routes/admin_routes.js"
const app = express()


app.use(cors());
app.use(express.json());


app.use('/api/user', user_routes)

app.use('/api/orders', order_routes)
app.use('/api/products', product_routes)
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

