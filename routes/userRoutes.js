const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  getUsers,
  getUserById,
  createUser,
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser
} = require("../controllers/userController");


router.get(
  "/",
  getUsers
);


router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      message:
        "You are authenticated",
      user: req.user
    });
  }
);


router.post(
  "/register",
  registerUser
);


router.post(
  "/login",
  loginUser
);


router.get(
  "/me",
  protect,
  getMe
);


router.get(
  "/:id",
  getUserById
);


router.post(
  "/",
  createUser
);


router.put(
  "/:id",
  updateUser
);


router.delete(
  "/:id",
  deleteUser
);


router.put(
  "/make-admin/:id",
  async (req, res) => {

    try {

      const User =
        require("../models/userModel");

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            isAdmin: true
          },
          {
            new: true
          }
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message:
            "User not found"
        });
      }

      res.json({
        message:
          "User is now an admin",
        user
      });

    } catch (error) {

      console.error(
        "Make admin error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to make user admin"
      });
    }
  }
);


module.exports = router;
