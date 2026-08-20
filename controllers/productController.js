const Product = require("../models/productModel");


// ============================
// GET ALL PRODUCTS
// ============================

const getProducts = async (req, res) => {

  const products = await Product.find();

  res.json(products);

};


// ============================
// GET ONE PRODUCT
// ============================

const getProductById = async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (!product) {

    return res.status(404).json({
      message: "Product not found"
    });

  }

  res.json(product);

};


// ============================
// CREATE PRODUCT
// ============================

const createProduct = async (req, res) => {

  const {
    name,
    price,
    category,
    image,
    badge,
    rating
  } = req.body;


  const newProduct = await Product.create({

    name,

    price,

    category,

    image,

    badge,

    rating

  });


  res.status(201).json(newProduct);

};


// ============================
// UPDATE PRODUCT
// ============================

const updateProduct = async (req, res) => {

  const product = await Product.findByIdAndUpdate(

    req.params.id,

    req.body,

    {
      new: true,
      runValidators: true
    }

  );


  if (!product) {

    return res.status(404).json({
      message: "Product not found"
    });

  }


  res.json(product);

};


// ============================
// DELETE PRODUCT
// ============================

const deleteProduct = async (req, res) => {

  const product = await Product.findByIdAndDelete(
    req.params.id
  );


  if (!product) {

    return res.status(404).json({
      message: "Product not found"
    });

  }


  res.json({

    message: "Product deleted successfully",

    product

  });

};


// ============================
// EXPORT CONTROLLERS
// ============================

module.exports = {

  getProducts,

  getProductById,

  createProduct,

  updateProduct,

  deleteProduct

};