const Order = require("../models/orderModel");


// ============================
// GET ALL ORDERS
// ============================

const getAllOrders = async (req, res) => {

  try {

    const orders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .populate(
          "products.productId",
          "name image"
        )
        .sort({
          createdAt: -1
        });


    res.json(orders);

  } catch (error) {

    console.error(
      "Get all orders error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to load orders"

    });

  }

};


// ============================
// GET ONE ORDER
// ============================

const getOrderById = async (req, res) => {

  try {

    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "products.productId",
          "name image"
        );


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found"

      });

    }


    res.json(order);

  } catch (error) {

    console.error(
      "Get admin order error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to load order"

    });

  }

};



// ============================
// UPDATE ORDER STATUS
// ============================

const updateOrderStatus = async (req, res) => {

  try {

    const {
      status
    } = req.body;


    // ============================
    // CHECK STATUS
    // ============================

    const allowedStatuses = [

      "Pending",

      "Processing",

      "Shipped",

      "Delivered",

      "Cancelled"

    ];


    if (
      !allowedStatuses.includes(
        status
      )
    ) {

      return res.status(400).json({

        message:
          "Invalid order status"

      });

    }


    // ============================
    // FIND ORDER
    // ============================

    const order =
      await Order.findById(
        req.params.id
      );


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found"

      });

    }


    // ============================
    // UPDATE STATUS
    // ============================

    order.status =
      status;


    await order.save();


    // ============================
    // POPULATE UPDATED ORDER
    // ============================

    const updatedOrder =
      await Order.findById(
        order._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "products.productId",
          "name image"
        );


    // ============================
    // LOG
    // ============================

    console.log(
      "ORDER STATUS UPDATED:"
    );

    console.log(
      updatedOrder._id,
      "→",
      updatedOrder.status
    );


    // ============================
    // SEND UPDATED ORDER
    // ============================

    res.json(
      updatedOrder
    );

  } catch (error) {

    console.error(
      "Update order status error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to update order status"

    });

  }

};


// ============================
// EXPORT
// ============================

module.exports = {

  getAllOrders,

  getOrderById,

  updateOrderStatus

};