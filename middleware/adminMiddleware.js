const User = require("../models/userModel");


// ============================
// ADMIN MIDDLEWARE
// ============================

const admin = async (req, res, next) => {

  try {

    // ============================
    // CHECK AUTHENTICATED USER
    // ============================

    if (!req.user) {

      return res.status(401).json({
        message: "Not authorized"
      });

    }


    // ============================
    // FIND USER
    // ============================

    const user = await User.findById(
      req.user.id
    );


    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }


    // ============================
    // CHECK ADMIN STATUS
    // ============================

    if (user.isAdmin !== true) {

      return res.status(403).json({
        message: "Admin access required"
      });

    }


    // ============================
    // ALLOW REQUEST
    // ============================

    next();

  } catch (error) {

    console.error(
      "Admin middleware error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }

};


module.exports = admin;