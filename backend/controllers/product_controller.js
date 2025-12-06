import { Product } from "../models/product_model.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            slug,
            category,
            stock
        } = req.body;

        const existing = await Product.findOne({ slug });
        if (existing)
            return res.status(400).json({ message: "Product with this slug already exists" });

       if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "Images required" });

    const images = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "comforty/products");
      images.push({
        url: result.secure_url,
        public_id: result.public_id,
        altText: name
      });
    }
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

        // Pagination
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNumber - 1) * pageSize;

        // Sorting
        let sortOption = {};
        if (sort) {
            const [field, order] = sort.split("_"); // e.g., price_asc or rating_desc
            sortOption[field] = order === "desc" ? -1 : 1;
        } else {
            sortOption = { createdAt: -1 }; // default newest first
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
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.files && req.files.length > 0) {
      // delete old images from Cloudinary
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // upload new images
      const newImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "comforty/products");
        newImages.push({
          url: result.secure_url,
          public_id: result.public_id,
          altText: product.name
        });
      }

      product.images = newImages;
    }

    // update other fields
    Object.assign(product, req.body);

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ slug: req.params.slug });
 for (const img of product.images) {
            await cloudinary.uploader.destroy(img.public_id);
        }

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
