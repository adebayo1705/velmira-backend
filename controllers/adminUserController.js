const User = require("../models/userModel");

// ============================
// GET ALL USERS
// ============================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to load users"
    });
  }
};


// ============================
// GET ONE USER
// ============================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Failed to load user"
    });
  }
};


// ============================
// EXPORT
// ============================

module.exports = {
  getAllUsers,
  getUserById
};