import { Product } from "../models/product_model.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../util/uploadtocloudinary.js";

export const createProduct = async (req, res) => {
    try {
                console.log('[product_controller] CLOUDINARY configured:', !!process.env.CLOUDINARY_CLOUD_NAME, !!process.env.CLOUDINARY_API_KEY);
        const {
            name,
            description,
            price,
            slug,
            category,
            stock
        } = req.body;

                // generate slug from name when not provided
                let finalSlug = slug;
                if (!finalSlug) {
                        if (!name) return res.status(400).json({ message: "Product name is required to generate slug" });
                        const base = name
                                .toString()
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9\s-]/g, '')
                                .replace(/\s+/g, '-')
                                .replace(/-+/g, '-');
                        let candidate = base;
                        let counter = 1;
                        // ensure uniqueness
                        while (await Product.findOne({ slug: candidate })) {
                                candidate = `${base}-${counter++}`;
                        }
                        finalSlug = candidate;
                } else {
                        const existing = await Product.findOne({ slug: finalSlug });
                        if (existing) return res.status(400).json({ message: "Product with this slug already exists" });
                }

        const images = [];
        if (req.files && req.files.length > 0) {
            for (const [i, file] of req.files.entries()) {
                try {
                    console.log(`[product_controller] uploading file ${i} originalname=${file.originalname} size=${file.size}`);
                    const result = await uploadToCloudinary(file.buffer, "comforty/products");
                    console.log('[product_controller] uploaded result:', result && result.public_id);
                    images.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                        altText: name
                    });
                } catch (uploadErr) {
                    console.error('[product_controller] upload error for file', file.originalname, uploadErr);
                    throw uploadErr;
                }
            }
        }
        const product = await Product.create({
            name,
            description,
            price,
            slug: finalSlug,
            category,
            images,
            stock,
            isAvailable: stock > 0
        });

        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error('[product_controller] Error creating product:', error);
        // In dev return message; do not leak stack in production
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
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body;

    // Update fields if provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) {
      product.stock = Number(stock);
      product.isAvailable = Number(stock) > 0;
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      // delete old images from Cloudinary
      for (const img of product.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (destroyErr) {
            console.error('[product_controller] Error deleting old image:', destroyErr);
          }
        }
      }

      // upload new images
      const newImages = [];
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer, "comforty/products");
          newImages.push({
            url: result.secure_url,
            public_id: result.public_id,
            altText: product.name || name || 'Product image'
          });
        } catch (uploadErr) {
          console.error('[product_controller] Error uploading image:', uploadErr);
          throw uploadErr;
        }
      }

      product.images = newImages;
    }

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error('[product_controller] Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};



export const deleteProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await Product.findOne({ slug });
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const img of product.images) {
                if (img.public_id) {
                    try {
                        await cloudinary.uploader.destroy(img.public_id);
                    } catch (destroyErr) {
                        console.error('[product_controller] Error deleting image from Cloudinary:', destroyErr);
                        // Continue even if image deletion fails
                    }
                }
            }
        }

        // Delete product from database
        await Product.findOneAndDelete({ slug });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('[product_controller] Error deleting product:', error);
        res.status(500).json({ message: error.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findOne({ slug: req.params.slug });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        // ensure reviews array exists
        product.reviews = product.reviews || [];

        const alreadyReviewed = product.reviews.find(
            (rev) => rev.user && rev.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed)
            return res.status(400).json({ message: "You already reviewed this product" });

        product.reviews.push({
            user: req.user._id,
            rating: Number(rating),
            comment: comment || ''
        });

        // recalculate averageRating
        product.averageRating =
            product.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) /
            (product.reviews.length || 1);

        await product.save();

        res.status(200).json({ message: "Review added successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
