const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");


// ============================
// ADMIN STATISTICS
// ============================

const getAdminStats = async (req, res) => {

  try {

    const totalProducts =
      await Product.countDocuments();


    const totalUsers =
      await User.countDocuments();


    const totalOrders =
      await Order.countDocuments();


    const revenueResult =
      await Order.aggregate([

        {
          $match: {
            status: {
              $ne: "Cancelled"
            }
          }
        },

        {
          $group: {

            _id: null,

            totalRevenue: {
              $sum: "$total"
            }

          }
        }

      ]);


    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;


    res.json({

      totalProducts,

      totalUsers,

      totalOrders,

      totalRevenue

    });


  } catch (error) {

    console.error(
      "Admin stats error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to get admin statistics"

    });

  }

};


// ============================
// EXPORT
// ============================

module.exports = {
  getAdminStats
};