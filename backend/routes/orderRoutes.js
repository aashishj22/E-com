const express= require("express");
const { isaAuthenticateUser,authorizeRole } = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();

router.route("/order/new").post( isaAuthenticateUser,newOrder);

router.route("/order/:id").get(isaAuthenticateUser,getSingleOrder);

router.route("/orders/me").get(isaAuthenticateUser, myOrders);

router
  .route("/admin/orders")
  .get(isaAuthenticateUser, authorizeRole("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isaAuthenticateUser, authorizeRole("admin"), updateOrder)
  .delete(isaAuthenticateUser, authorizeRole("admin"), deleteOrder);

module.exports = router;
