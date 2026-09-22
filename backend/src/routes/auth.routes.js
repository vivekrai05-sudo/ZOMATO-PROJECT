const express = require("express");
const authController = require("../controllers/auth.controller");
const { authUserMiddleware, authFoodPartnerMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// User auth routes
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
router.get("/user/me", authUserMiddleware, authController.getUserMe);

// Food partner auth routes
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);
router.get("/food-partner/me", authFoodPartnerMiddleware, authController.getFoodPartnerMe);

module.exports = router;
