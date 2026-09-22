const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const router = express.Router();

/* ===== Multer setup ===== */
const upload = multer({
  storage: multer.memoryStorage(), // video RAM me aayegi
});

/* ===== GET /api/food (Public Feed) ===== */
router.get("/", foodController.getAllFood);

/* ===== GET /api/food/partner (Partner's list) ===== */
router.get(
  "/partner",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getPartnerFood
);

/* ===== POST /api/food (Upload Reel) ===== */
router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"), // key name must be "video"
  foodController.createFood
);

/* ===== GET /api/food/partner-profile/:partnerId ===== */
router.get("/partner-profile/:partnerId", foodController.getPartnerPublicProfile);

/* ===== DELETE /api/food/:id ===== */
router.delete(
  "/:id",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.deleteFood
);

/* ===== POST /api/food/:id/like ===== */
router.post(
  "/:id/like",
  authMiddleware.authUserMiddleware,
  foodController.toggleLikeFood
);

/* ===== POST /api/food/:id/save ===== */
router.post(
  "/:id/save",
  authMiddleware.authUserMiddleware,
  foodController.toggleSaveFood
);

/* ===== POST /api/food/:id/comment ===== */
router.post(
  "/:id/comment",
  authMiddleware.authUserMiddleware,
  foodController.addComment
);

module.exports = router;
