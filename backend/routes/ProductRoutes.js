const express= require("express");
const { getAllProducts, createProduct, updateProduct, deletePrroduct, getSingleProducts, createProductReview, getAllReview, deleteReview,  } = require("../controllers/productController");
const { isaAuthenticateUser,authorizeRole } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get( getAllProducts);
router.route("/admin/product/new").post(isaAuthenticateUser,authorizeRole("admin"),isaAuthenticateUser,createProduct);
router.route("/admin/product/:id").put(isaAuthenticateUser,authorizeRole("admin"),isaAuthenticateUser,updateProduct);
router.route("/admin/product/:id").delete(isaAuthenticateUser,authorizeRole("admin"),isaAuthenticateUser,deletePrroduct);
router.route("/product/:id").get(getSingleProducts);
router.route("/review").put(isaAuthenticateUser,createProductReview);
router.route("/reviews").get(getAllReview);
router.route("/reviews").delete(isaAuthenticateUser, deleteReview);





module.exports=router;