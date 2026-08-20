const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1
      });

    res.json(users);

  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to get users"
    });
  }
};


const getUserById = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Failed to get user"
    });
  }
};


const createUser = async (req, res) => {
  try {
    const {
      name,
      email
    } = req.body;

    const newUser =
      await User.create({
        name,
        email
      });

    res.status(201).json(newUser);

  } catch (error) {
    console.error("Create user error:", error);

    res.status(500).json({
      message: "Failed to create user"
    });
  }
};


const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Please provide name, email and password"
      });
    }

    const existingUser =
      await User.findOne({
        email
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: false
      });

    res.status(201).json({
      message:
        "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin:
          user.isAdmin === true
      }
    });

  } catch (error) {
    console.error(
      "Register user error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to register user"
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please provide email and password"
      });
    }

    const user =
      await User.findOne({
        email
      });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const token =
      jwt.sign(
        {
          id: user._id,
          isAdmin:
            user.isAdmin === true
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

    res.json({
      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin:
          user.isAdmin === true
      }
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message:
        "Login failed"
    });
  }
};


const getMe = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message:
          "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to get current user"
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const {
      name,
      email
    } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email
        },
        {
          new: true,
          runValidators: true
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message:
          "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    console.error(
      "Update user error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update user"
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found"
      });
    }

    res.json({
      message:
        "User deleted successfully",
      user
    });

  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete user"
    });
  }
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  registerUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser
};
