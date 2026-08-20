const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  initializePayment,
  verifyPayment,
  paystackWebhook
} = require("../controllers/paymentController");


// ============================
// INITIALIZE PAYMENT
// ============================

router.post(
  "/initialize",
  protect,
  initializePayment
);


// ============================
// VERIFY PAYMENT
// ============================

router.get(
  "/verify/:reference",
  verifyPayment
);


// ============================
// PAYSTACK WEBHOOK
// ============================

router.post(
  "/webhook",
  paystackWebhook
);


module.exports = router;