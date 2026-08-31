import mongoose from "mongoose";
import path from 'path';
import fs from 'fs';
import ProductModel from "../models/productSchema.js";
import HttpStatus from "../constants/http-status.constant.js";
import ToastyConstant from "../constants/toasty.constant.js";

const removeUploadedFile = (filename) => {
    const filePath = path.join(`${process.env.UPLOAD_DIRECTORY}/productimage`, filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            throw new Error(ToastyConstant.SERVER.INTERNAL_SERVER_ERROR);
        }
    });
};

const addProduct = async (req, res) => {
    try {
        const { title, price, description } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!title || !title.trim() || !price || !description || !description.trim() || !image) {
            if (image) removeUploadedFile(image);
            return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: 'Title, price, description and a product image are all required.' });
        }

        if (isNaN(price) || Number(price) <= 0) {
            if (image) removeUploadedFile(image);
            return res.status(HttpStatus.BAD_REQUEST).json({ status: false, message: 'Price must be a valid number greater than 0.' });
        }

        if (!req.user || !req.user._id) {
            if (image) removeUploadedFile(image);
            return res.status(HttpStatus.UNAUTHORIZED).json({ status: false, message: "Authorization Failed" });
        }
        const authorId = req.user._id.toString();

        const newProduct = new ProductModel({
            title: title.trim(),
            price,
            description,
            image,
            authorId,
            createdAt: new Date()
        })

        const savedProduct = await newProduct.save();
        if (savedProduct) {
            return res.status(201).json({ status: true, message: "Product created successfully", product: savedProduct });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: "Something Went Wrong" });
        }
    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

const removeProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const authorId = req.user._id.toString();
        const product = await ProductModel.findOne({ _id: productId, authorId });
        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({ status: false, message: "Product not found" });
        }

        if (product.image) {
            removeUploadedFile(product.image);
        }
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);
        if (deletedProduct) {
            return res.status(HttpStatus.OK).json({ status: true, message: "Product Deleted Successfully" });
        } else {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: "Something Went Wrong" });
        }
    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, price, description } = req.body;
    const authorId = req.user._id.toString();

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: false,
        message: "Product not found",
      });
    }

    // 🔐 ownership check
    if (product.authorId.toString() !== authorId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    // 🖼 image update
    if (req.file) {
      removeUploadedFile(product.image); // old image delete
      product.image = req.file.filename;
    }

    // ✏️ update fields
    if (title) product.title = title;
    if (price) {
      if (isNaN(price) || Number(price) <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: false,
          message: "Price must be greater than 0",
        });
      }
      product.price = price;
    }
    if (description) product.description = description;

    product.updatedAt = new Date();

    await product.save();

    return res.status(HttpStatus.OK).json({
      status: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR,
    });
  }
};


const getAllProduct = async (req, res) => {
    try {
        const { limit, sort } = req.query;
        const authorId = req.user._id.toString();

        let productsQuery = ProductModel.find({ authorId });

        if (sort === 'createdAt') {
            productsQuery = productsQuery.sort({ createdAt: -1 });
        }

        if (limit) {
            productsQuery = productsQuery.limit(parseInt(limit));
        }

        const products = await productsQuery;
        return res.status(HttpStatus.OK).json({ status: true, products });

    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ProductModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(productId) }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: "$author"
            }, {
                $project: {
                    _id: 1,
                    title: 1,
                    image: 1,
                    price: 1,
                    description: 1,
                    authorName: "$author.fullName",
                    authorEmail: "$author.email",
                    createdAt: 1,
                    __v: 1
                }
            }
        ])

        if (!product) {
            return res.status(HttpStatus.NOT_FOUND).json({ status: false, message: "Product not found" });
        }
        return res.status(HttpStatus.OK).json({ status: true, message: "Data Fetched Successfully", product: product[0] });
    } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: ToastyConstant.SERVER.INTERNAL_SERVER_ERROR });
    }
}

export { addProduct, removeProduct, editProduct, getAllProduct, getSingleProduct };