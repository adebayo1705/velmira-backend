const express = require("express");

const router = express.Router();

const {
  sendContactMessage
} = require("../controllers/contactController");


// ============================
// SEND CONTACT MESSAGE
// ============================

router.post(
  "/",
  sendContactMessage
);


module.exports = router;