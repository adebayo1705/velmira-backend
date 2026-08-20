const Order = require("../models/orderModel");
const Product = require("../models/productModel");


// ============================
// GET ALL ORDERS
// ============================

const getOrders = async (req, res) => {

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
      "Get orders error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to get orders"

    });

  }

};


// ============================
// GET ONE ORDER
// ============================

const getOrderById = async (req, res) => {

  try {

    const order =
      await Order.findOne({

        _id:
          req.params.id,

        user:
          req.user.id

      })
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
      "Get order error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to get order"

    });

  }

};


// ============================
// GET MY ORDERS
// ============================

const getMyOrders = async (req, res) => {

  try {

    const orders =
      await Order.find({

        user:
          req.user.id

      })
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
      "Get my orders error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to get your orders"

    });

  }

};


// ============================
// CREATE ORDER
// ============================

const createOrder = async (req, res) => {

  try {

const {

  customer,

  products,

  delivery,

  paymentMethod,

  paymentReference

} = req.body;

    // ============================
    // CHECK PRODUCTS
    // ============================

    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {

      return res.status(400).json({

        message:
          "Order must contain at least one product."

      });

    }


    // ============================
    // CHECK DELIVERY
    // ============================

    if (
      !delivery ||
      !delivery.method
    ) {

      return res.status(400).json({

        message:
          "Delivery method is required."

      });

    }


    // ============================
    // CHECK PAYMENT METHOD
    // ============================

    if (!paymentMethod) {

      return res.status(400).json({

        message:
          "Payment method is required."

      });

    }


    // ============================
    // CHECK PAYMENT REFERENCE
    // ============================

    if (!paymentReference) {

      return res.status(400).json({

        message:
          "Payment reference is required."

      });

    }


    // ============================
    // DELIVERY PRICES
    // ============================

    const deliveryPrices = {

      "Standard Delivery":
        2000,

      "Express Delivery":
        5000,

      "Pickup Station":
        50

    };


    const deliveryFee =
      deliveryPrices[
        delivery.method
      ];


    if (
      deliveryFee ===
      undefined
    ) {

      return res.status(400).json({

        message:
          "Invalid delivery method."

      });

    }


    // ============================
    // VERIFY PRODUCTS
    // ============================

    let subtotal = 0;

    const verifiedProducts = [];


    for (
      const item of products
    ) {

      // ============================
      // CHECK PRODUCT INFORMATION
      // ============================

      if (
        !item.productId ||
        !item.quantity ||
        Number(item.quantity) <= 0
      ) {

        return res.status(400).json({

          message:
            "Invalid product information."

        });

      }


      // ============================
      // FIND PRODUCT IN DATABASE
      // ============================

      const product =
        await Product.findById(
          item.productId
        );


      if (!product) {

        return res.status(404).json({

          message:
            `Product not found: ${item.productId}`

        });

      }


      // ============================
      // CALCULATE PRODUCT TOTAL
      // ============================

      const quantity =
        Number(item.quantity);


      const itemTotal =
        product.price *
        quantity;


      subtotal +=
        itemTotal;


      // ============================
      // SAVE VERIFIED PRODUCT
      // ============================

      verifiedProducts.push({

        productId:
          product._id,

        quantity,

        price:
          product.price

      });

    }


    // ============================
    // CALCULATE FINAL TOTAL
    // ============================

    const total =
      subtotal +
      deliveryFee;


    // ============================
    // CREATE ORDER
    // ============================

const newOrder =
  await Order.create({

    user:
      req.user.id,

    customer,

    products:
      verifiedProducts,

    delivery,

    paymentMethod,

    // ============================
    // PAYMENT ALWAYS STARTS AS PENDING
    // ============================
    // Never trust paymentStatus from
    // the frontend.
    // Paystack verification is responsible
    // for changing this to "Paid".

    paymentStatus:
      "Pending",

    paymentReference,

    // ============================
    // ORDER STARTS AS PENDING
    // ============================

    status:
      "Pending",

    total

  });

    // ============================
    // POPULATE ORDER
    // ============================

    const populatedOrder =
      await Order.findById(
        newOrder._id
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
    // LOG FINAL ORDER
    // ============================

    console.log(
      "FINAL ORDER CREATED:"
    );

    console.log(
      populatedOrder
    );


    // ============================
    // SEND ORDER
    // ============================

    res.status(201).json(
      populatedOrder
    );


  } catch (error) {

    console.error(
      "Create order error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to create order"

    });

  }

};


// ============================
// UPDATE ORDER
// ============================

const updateOrder = async (req, res) => {

  try {

    // ============================
    // FIND USER'S ORDER
    // ============================

    const order =
      await Order.findOne({

        _id:
          req.params.id,

        user:
          req.user.id

      });


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found"

      });

    }


    // ============================
    // CHECK ALLOWED UPDATES
    // ============================

    // Customers are NOT allowed
    // to change payment status.

    if (
      req.body.paymentStatus !==
      undefined ||
      req.body.paymentReference !==
      undefined
    ) {

      return res.status(403).json({

        message:
          "Payment information cannot be updated directly."

      });

    }


    // ============================
    // SAVE ORDER
    // ============================

    await order.save();


    // ============================
    // POPULATE ORDER
    // ============================

    const populatedOrder =
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
    // SEND ORDER
    // ============================

    res.json(
      populatedOrder
    );


  } catch (error) {

    console.error(
      "Update order error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to update order"

    });

  }

};

// ============================
// DELETE ORDER
// ============================

const deleteOrder = async (req, res) => {

  try {

    const order =
      await Order.findOne({

        _id:
          req.params.id,

        user:
          req.user.id

      });


    if (!order) {

      return res.status(404).json({

        message:
          "Order not found"

      });

    }


    // ============================
    // DO NOT ALLOW PAID ORDERS
    // TO BE DELETED
    // ============================

    if (
      order.paymentStatus ===
      "Paid"
    ) {

      return res.status(400).json({

        message:
          "Paid orders cannot be deleted."

      });

    }


    await Order.findByIdAndDelete(
      order._id
    );


    res.json({

      message:
        "Order deleted successfully"

    });

  } catch (error) {

    console.error(
      "Delete order error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to delete order"

    });

  }

};


// ============================
// EXPORT CONTROLLERS
// ============================

module.exports = {

  getOrders,

  getOrderById,

  getMyOrders,

  createOrder,

  updateOrder,

  deleteOrder

};