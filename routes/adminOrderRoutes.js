const express = require("express");

const router = express.Router();

const {

  getAllOrders,

  getOrderById,

  updateOrderStatus

} = require("../controllers/adminOrderController");

const protect =
  require("../middleware/authMiddleware");

const admin =
  require("../middleware/adminMiddleware");


// ============================
// GET ALL ORDERS
// ============================

router.get(

  "/",

  protect,

  admin,

  getAllOrders

);


// ============================
// GET ONE ORDER
// ============================

router.get(

  "/:id",

  protect,

  admin,

  getOrderById

);


// ============================
// UPDATE ORDER STATUS
// ============================

router.put(

  "/:id/status",

  protect,

  admin,

  updateOrderStatus

);


module.exports = router;