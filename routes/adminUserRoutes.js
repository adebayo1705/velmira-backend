const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById
} = require("../controllers/adminUserController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// ============================
// GET ALL USERS
// ============================

router.get(
  "/",
  protect,
  admin,
  getAllUsers
);


// ============================
// GET ONE USER
// ============================

router.get(
  "/:id",
  protect,
  admin,
  getUserById
);


module.exports = router;