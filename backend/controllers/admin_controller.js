import Order from "../models/order_model.js";
import { Product } from "../models/product_model.js";
import { User } from "../models/user_model.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalSalesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" }
                }
            }
        ]);
        const totalSales = totalSalesData[0] ? totalSalesData[0].totalSales : 0;

        const topProducts = await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.product",
                    quantitySold: { $sum: "$products.quantity" }
                }
            },
            { $sort: { quantitySold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "comfortyproducts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    name: "$product.name",
                    slug: "$product.slug",
                    quantitySold: 1
                }
            }
        ]);

        const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isAvailable: true })
            .select("name stock slug");

        res.status(200).json({
            totalUsers,
            totalOrders,
            totalSales,
            topProducts,
            lowStockProducts
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
