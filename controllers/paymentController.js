const axios = require("axios");
const crypto = require("crypto");

const Order = require("../models/orderModel");


// ========================================
// PRODUCTION FRONTEND URL
// ========================================

const FRONTEND_URL =
  "https://velmira-peach.vercel.app";


// ========================================
// INITIALIZE PAYSTACK PAYMENT
// ========================================

const initializePayment = async (req, res) => {

  try {

    const {
      email,
      amount,
      reference
    } = req.body;


    // ========================================
    // CHECK REQUIRED INFORMATION
    // ========================================

    if (
      !email ||
      !amount ||
      !reference
    ) {

      return res.status(400).json({

        message:
          "Email, amount and reference are required."

      });

    }


    // ========================================
    // CHECK AUTHENTICATION
    // ========================================

    if (
      !req.user ||
      !req.user.id
    ) {

      return res.status(401).json({

        message:
          "You must be logged in to make a payment."

      });

    }


    // ========================================
    // CONVERT AMOUNT TO KOBO
    // ========================================

    const amountInKobo =
      Math.round(
        Number(amount) * 100
      );


    // ========================================
    // VALIDATE AMOUNT
    // ========================================

    if (
      !Number.isFinite(amountInKobo) ||
      amountInKobo <= 0
    ) {

      return res.status(400).json({

        message:
          "Invalid payment amount."

      });

    }


    // ========================================
    // LOG PAYMENT INFORMATION
    // ========================================

    console.log(
      "================================="
    );

    console.log(
      "PAYSTACK INITIALIZATION REQUEST"
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "Amount received:",
      amount
    );

    console.log(
      "Amount in Kobo:",
      amountInKobo
    );

    console.log(
      "Reference:",
      reference
    );

    console.log(
      "================================="
    );


    // ========================================
    // INITIALIZE TRANSACTION
    // ========================================

    const response =
      await axios.post(

        "https://api.paystack.co/transaction/initialize",

        {

          email,

          amount:
            amountInKobo,

          reference,


          // ========================================
          // SUCCESS CALLBACK
          // ========================================

callback_url:
  "https://velmira-peach.vercel.app/payment/callback",

metadata: {

  cancel_action:
    "https://velmira-peach.vercel.app/payment/callback"

}
        },

        {

          headers: {

            Authorization:
              `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json"

          },

          timeout:
            15000

        }

      );


    // ========================================
    // PAYSTACK RESPONSE
    // ========================================

    console.log(
      "PAYSTACK API RESPONDED"
    );


    console.log(
      "PAYSTACK RESPONSE:",
      response.data
    );


    // ========================================
    // RETURN RESPONSE
    // ========================================

    return res.status(200).json(

      response.data

    );


  } catch (error) {

    console.error(
      "PAYSTACK INITIALIZATION ERROR:",
      error.response?.data ||
      error.message
    );


    return res.status(500).json({

      message:
        "Failed to initialize Paystack payment."

    });

  }

};



// ========================================
// VERIFY PAYSTACK PAYMENT
// ========================================

const verifyPayment = async (req, res) => {

  try {

    const {
      reference
    } = req.params;


    // ========================================
    // CHECK REFERENCE
    // ========================================

    if (!reference) {

      return res.status(400).json({

        message:
          "Payment reference is required."

      });

    }


    // ========================================
    // VERIFY WITH PAYSTACK
    // ========================================

    const response =
      await axios.get(

        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,

        {

          headers: {

            Authorization:
              `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

            "Content-Type":
              "application/json"

          },

          timeout:
            15000

        }

      );


    // ========================================
    // GET PAYMENT DATA
    // ========================================

    const paymentData =
      response.data?.data;


    console.log(
      "================================="
    );

    console.log(
      "PAYSTACK PAYMENT VERIFICATION"
    );

    console.log(
      "Reference:",
      reference
    );

    console.log(
      "Paystack status:",
      paymentData?.status
    );

    console.log(
      "Gateway response:",
      paymentData?.gateway_response
    );

    console.log(
      "Amount:",
      paymentData?.amount
    );

    console.log(
      "================================="
    );


    // ========================================
    // FIND ORDER
    // ========================================

    const order =
      await Order.findOne({

        paymentReference:
          reference

      });


    if (!order) {

      console.log(
        "NO ORDER FOUND FOR PAYMENT:",
        reference
      );


      return res.status(404).json({

        message:
          "Order associated with this payment was not found."

      });

    }


    // ========================================
    // VERIFY PAYMENT AMOUNT
    // ========================================

    const expectedAmount =
      Math.round(
        Number(order.total) * 100
      );


    if (
      paymentData?.amount !==
      expectedAmount
    ) {

      console.log(
        "PAYMENT AMOUNT MISMATCH"
      );

      console.log(
        "Expected:",
        expectedAmount
      );

      console.log(
        "Received:",
        paymentData?.amount
      );


      return res.status(400).json({

        message:
          "Payment amount does not match the order amount."

      });

    }


    // ========================================
    // PAYMENT SUCCESS
    // ========================================

    if (
      paymentData?.status ===
      "success"
    ) {

      order.paymentStatus =
        "Paid";


      await order.save();


      console.log(
        "ORDER PAYMENT VERIFIED:",
        order._id
      );

    }


    // ========================================
    // PAYMENT FAILED
    // ========================================

    else if (
      paymentData?.status ===
      "failed"
    ) {

      if (
        order.paymentStatus !==
        "Paid"
      ) {

        order.paymentStatus =
          "Failed";


        await order.save();

      }


      console.log(
        "ORDER PAYMENT FAILED:",
        order._id
      );

    }


    // ========================================
    // PAYMENT ABANDONED
    // ========================================

    else if (
      paymentData?.status ===
      "abandoned"
    ) {

      if (
        order.paymentStatus !==
        "Paid"
      ) {

        order.paymentStatus =
          "Failed";


        await order.save();

      }


      console.log(
        "ORDER PAYMENT ABANDONED:",
        order._id
      );

    }


    // ========================================
    // OTHER STATUS
    // ========================================

    else {

      console.log(
        "PAYMENT STATUS NOT FINAL:",
        paymentData?.status
      );

    }


    // ========================================
    // RETURN PAYSTACK RESPONSE
    // ========================================

    return res.status(200).json(

      response.data

    );


  } catch (error) {

    console.error(
      "PAYSTACK VERIFICATION ERROR:",
      error.response?.data ||
      error.message
    );


    return res.status(500).json({

      message:
        "Failed to verify Paystack payment."

    });

  }

};



// ========================================
// PAYSTACK WEBHOOK
// ========================================

const paystackWebhook = async (req, res) => {

  try {

    // ========================================
    // GET SIGNATURE
    // ========================================

    const signature =
      req.headers[
        "x-paystack-signature"
      ];


    // ========================================
    // CHECK SIGNATURE
    // ========================================

    if (!signature) {

      return res.status(401).json({

        message:
          "Missing Paystack signature"

      });

    }


    // ========================================
    // CREATE HASH
    // ========================================

    const hash =
      crypto
        .createHmac(
          "sha512",
          process.env.PAYSTACK_SECRET_KEY
        )
        .update(
          req.rawBody || ""
        )
        .digest("hex");


    // ========================================
    // VERIFY SIGNATURE
    // ========================================

    if (
      hash !==
      signature
    ) {

      console.log(
        "INVALID PAYSTACK WEBHOOK SIGNATURE"
      );


      return res.status(401).json({

        message:
          "Invalid signature"

      });

    }


    // ========================================
    // GET EVENT
    // ========================================

    const event =
      req.body;


    console.log(
      "PAYSTACK WEBHOOK EVENT:",
      event
    );


    // ========================================
    // PAYMENT SUCCESS
    // ========================================

    if (
      event.event ===
      "charge.success"
    ) {

      const reference =
        event.data.reference;


      console.log(
        "PAYSTACK PAYMENT SUCCESS:",
        reference
      );


      // ========================================
      // FIND ORDER
      // ========================================

      const order =
        await Order.findOne({

          paymentReference:
            reference

        });


      if (!order) {

        console.log(
          "ORDER NOT FOUND FOR PAYMENT:",
          reference
        );


        return res.status(200).json({

          message:
            "Webhook received"

        });

      }


      // ========================================
      // VERIFY WEBHOOK AMOUNT
      // ========================================

      const expectedAmount =
        Math.round(
          Number(order.total) * 100
        );


      if (
        event.data.amount !==
        expectedAmount
      ) {

        console.log(
          "WEBHOOK AMOUNT MISMATCH:",
          reference
        );


        return res.status(400).json({

          message:
            "Payment amount mismatch"

        });

      }


      // ========================================
      // MARK ORDER AS PAID
      // ========================================

      if (
        order.paymentStatus !==
        "Paid"
      ) {

        order.paymentStatus =
          "Paid";


        await order.save();

      }


      console.log(
        "ORDER PAYMENT UPDATED:",
        order._id
      );

    }


    // ========================================
    // RESPOND TO PAYSTACK
    // ========================================

    return res.status(200).json({

      message:
        "Webhook received"

    });


  } catch (error) {

    console.error(
      "PAYSTACK WEBHOOK ERROR:",
      error
    );


    return res.status(500).json({

      message:
        "Webhook processing failed"

    });

  }

};



// ========================================
// EXPORT
// ========================================

module.exports = {

  initializePayment,

  verifyPayment,

  paystackWebhook

};