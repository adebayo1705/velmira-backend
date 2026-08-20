const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");


// ============================
// GET ALL ORDERS
// ============================

router.get(
  "/",
  getOrders
);


// ============================
// GET MY ORDERS
// ============================

router.get(
  "/my-orders",
  protect,
  getMyOrders
);


// ============================
// GET ONE ORDER
// ============================

router.get(
  "/:id",
  protect,
  getOrderById
);


// ============================
// CREATE ORDER
// ============================

router.post(
  "/",
  protect,
  createOrder
);


// ============================
// UPDATE ORDER
// ============================

router.put(
  "/:id",
  protect,
  updateOrder
);


// ============================
// DELETE ORDER
// ============================

router.delete(
  "/:id",
  protect,
  deleteOrder
);


module.exports = router;