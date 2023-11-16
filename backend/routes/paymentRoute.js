const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isaAuthenticateUser } = require("../middleware/auth");

router.route("/payment/process").post(isaAuthenticateUser, processPayment);
router.route("/stripeapikey").get(isaAuthenticateUser, sendStripeApiKey);

module.exports = router;