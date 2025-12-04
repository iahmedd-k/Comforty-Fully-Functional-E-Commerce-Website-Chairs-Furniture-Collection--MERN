import { Product } from "../models/product_model.js";

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            slug,
            category,
            images,
            stock
        } = req.body;

        const existing = await Product.findOne({ slug });
        if (existing)
            return res.status(400).json({ message: "Product with this slug already exists" });

        const product = await Product.create({
            name,
            description,
            price,
            slug,
            category,
            images,
            stock,
            isAvailable: stock > 0
        });

        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const {
            keyword,
            category,
            minPrice,
            maxPrice,
            minRating,
            isAvailable,
            page = 1,
            limit = 20,
            sort
        } = req.query;

        const filter = {};

        if (keyword) {
            filter.name = { $regex: keyword, $options: "i" };
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (minRating) {
            filter.averageRating = { $gte: Number(minRating) };
        }

        if (isAvailable !== undefined) {
            filter.isAvailable = isAvailable === "true";
        }

        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNumber - 1) * pageSize;

        let sortOption = {};
        if (sort) {
            const [field, order] = sort.split("_");
            sortOption[field] = order === "desc" ? -1 : 1;
        } else {
            sortOption = { createdAt: -1 };
        }

        const totalProducts = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .populate("reviews.user", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            totalProducts,
            page: pageNumber,
            pages: Math.ceil(totalProducts / pageSize),
            products
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate("reviews.user", "name email");

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updates = req.body;

        if (updates.stock !== undefined) {
            updates.isAvailable = updates.stock > 0;
        }

        const product = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            updates,
            { new: true }
        );

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ slug: req.params.slug });

        if (!product)
            return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findOne({ slug: req.params.slug });
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        const alreadyReviewed = product.reveiws.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed)
            return res.status(400).json({ message: "You already reviewed this product" });

        product.reveiws.push({
            user: req.user._id,
            rating,
            comment
        });

        product.averageRating =
            product.reveiws.reduce((acc, r) => acc + r.rating, 0) /
            product.reveiws.length;

        await product.save();

        res.status(200).json({ message: "Review added successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
