const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(

  {
    // ============================
    // USER
    // ============================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },


    // ============================
    // CUSTOMER
    // ============================

    customer: {

      name: {
        type: String,
        required: true
      },

      email: {
        type: String,
        required: true
      }

    },


    // ============================
    // PRODUCTS
    // ============================

    products: [

      {

        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        price: {
          type: Number,
          required: true
        }

      }

    ],


    // ============================
    // DELIVERY
    // ============================

    delivery: {

      address: {
        type: String,
        required: true
      },

      method: {
        type: String,
        required: true
      }

    },


    // ============================
    // PAYMENT
    // ============================

    paymentMethod: {
      type: String,
      required: true
    },

    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed"
      ],

      default: "Pending"
    },

    paymentReference: {
      type: String,
      default: ""
    },


    // ============================
    // TOTAL
    // ============================

    total: {
      type: Number,
      required: true,
      min: 0
    },


    // ============================
    // ORDER STATUS
    // ============================

    status: {

      type: String,

      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
      ],

      default: "Pending"

    }

  },

  {
    timestamps: true
  }

);


module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );