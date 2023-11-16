const express= require("express");
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUerDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateProfileRole, deleteUser } = require("../controllers/userController");
const router = express.Router();

const {isaAuthenticateUser,authorizeRole} = require("../middleware/auth");



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/passsword/forgot").post(forgotPassword);
router.route("/passsword/reset/:token").put(resetPassword);
router.route("/me").get(isaAuthenticateUser,getUerDetails);
router.route("/password/update").put(isaAuthenticateUser,updatePassword);
router.route("/me/update").put(isaAuthenticateUser,updateProfile);

router.route("/admin/users").get(isaAuthenticateUser,authorizeRole("admin"),getAllUsers);
router.route("/admin/users/:id").get(isaAuthenticateUser,authorizeRole("admin"),getSingleUser);
router.route("/admin/users/:id").put(isaAuthenticateUser,authorizeRole("admin"),updateProfileRole);
router.route("/admin/users/:id").delete(isaAuthenticateUser,authorizeRole("admin"),deleteUser);








router.route("/logout").get(logout);




module.exports = router