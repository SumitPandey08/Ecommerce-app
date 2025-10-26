import Product from "../models/product.model.js";
import Seller from "../models/seller.model.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
//import elasticsearchClient from "../utils/elasticSerachClient.js";

// CREATE PRODUCT with Cloudinary image upload support
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, sellerId } = req.body;

  if (!name || !description || !price || !category || !stock || !sellerId) {
    res.status(400);
    throw new Error("All fields except images are required.");
  }

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    res.status(404);
    throw new Error("Seller not found.");
  }

  // Handle image uploads (single or multiple)
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result?.url) imageUrls.push(result.url);
    }
  } else if (req.file && req.file.path) {
    const result = await uploadOnCloudinary(req.file.path);
    if (result?.url) imageUrls.push(result.url);
  }

  // Map image URLs into schema objects
  const images = imageUrls.map(url => ({ url, altText: "" }));

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    seller: seller._id,
    images,
    isVerified: false // Only this is needed for verification
  });

  res.status(201).json({ message: "Product created successfully.", product });
});


export const getAllProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  try {
    const products = await Product.find().skip(skip).limit(limit).populate("seller", "name email companyName");
    res.json(products);
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch products.");
  }
});

// GET PRODUCT BY ID
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }
  const product = await Product.findById(id).populate("seller", "name email companyName");
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  res.json(product);
});

// UPDATE PRODUCT with optional Cloudinary image upload
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }

  const updateFields = { ...req.body };
  delete updateFields.seller; // Prevent changing ownership

  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result?.url) imageUrls.push(result.url);
    }
    updateFields.images = imageUrls.map(url => ({ url, altText: "" }));
  } else if (req.file && req.file.path) {
    const result = await uploadOnCloudinary(req.file.path);
    if (result?.url) updateFields.images = [{ url: result.url, altText: "" }];
  }

  const product = await Product.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  res.json({ message: "Product updated successfully.", product });
});

// DELETE PRODUCT
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid product ID.");
  }
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  res.json({ message: "Product deleted successfully.", productId: id });
});

// GET ALL PRODUCTS FOR A SELLER
export const getSellerProducts = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    res.status(400);
    throw new Error("Invalid seller ID.");
  }
  const products = await Product.find({ seller: sellerId });
  res.json(products);
});

const productFilter = (req,res) => {
  const query = req.query;
  let filter = {};
  // Category filter
  if (query.category) filter.category = query.category;
  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  // In stock filter
  if (query.inStock === 'true') filter.stock = { $gt: 0 };
  // Verified filter
  if (query.isVerified) filter.isVerified = query.isVerified === 'true';
  // Name search (partial match)
  if (query.name) filter.name = { $regex: query.name, $options: 'i' };
  // Seller filter
  if (query.sellerId && mongoose.Types.ObjectId.isValid(query.sellerId)) {
    filter.seller = query.sellerId;
  }
  return filter;
}

// FILTER PRODUCTS
export const filterProducts = asyncHandler(async (req, res) => {
  const filter = productFilter(req, res);
  // Sorting
  let sort = {};
  const { sortBy, order } = req.query;
  if (sortBy) {
    sort[sortBy] = order === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1; // Default: newest first
  }
  const products = await Product.find(filter)
    .populate("seller", "name email companyName")
    .sort(sort);
  res.json(products);
});




// elastis base search


// export const searchProducts = asyncHandler(async (req, res) => {
//  try {
//   const searchText = req.query.q;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;
  
//   if (!searchText) {
//     res.status(400);
//     throw new Error("Search text is required.");
//   }
  
//   const { body } = await elasticsearchClient.search({
//     index: 'products',
//     from: skip,
//     size: limit,
//     body: {
//       query: {
//         multi_match: {
//           query: searchText,
//           fields: ['name^3', 'description', 'category']
//         }
//       }
//     }
//   });
//   const hits = body.hits.hits;
//   const results = hits.map(hit => hit._source);
//   res.json({
//     page,
//     limit,
//     totalResults: body.hits.total.value,
//     results
//   });

//  } catch (error) {
//    console.error("Elasticsearch search error:", error);
//    res.status(500);
//    throw new Error("Failed to search products.");
//  }
// });