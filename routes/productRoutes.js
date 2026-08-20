const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");


// ============================
// GET ALL PRODUCTS
// ============================

router.get("/", getProducts);


// ============================
// GET ONE PRODUCT
// ============================

router.get("/:id", getProductById);


// ============================
// CREATE PRODUCT
// ============================

router.post("/", createProduct);


// ============================
// UPDATE PRODUCT
// ============================

router.put("/:id", updateProduct);


// ============================
// DELETE PRODUCT
// ============================

router.delete("/:id", deleteProduct);


module.exports = router;