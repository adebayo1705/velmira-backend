const express = require("express");

const router = express.Router();

const {
  getAdminStats
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// ============================
// ADMIN DASHBOARD STATISTICS
// ============================

router.get(
  "/stats",
  protect,
  admin,
  getAdminStats
);


// ============================
// EXPORT
// ============================

module.exports = router;