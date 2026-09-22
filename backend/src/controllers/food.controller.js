const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

async function createFood(req, res) {
  try {
    const { name, title, description, price, category } = req.body;
    const foodName = name || title;

    if (!foodName) {
      return res.status(400).json({
        message: "Food item title/name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Video file is required",
      });
    }

    let videoUrl = "";

    try {
      const uploadResult = await storageService.uploadFile(
        req.file.buffer,
        `${uuid()}-${req.file.originalname || "video.mp4"}`
      );
      videoUrl = uploadResult.url;
    } catch (uploadError) {
      console.warn("IMAGEKIT UPLOAD WARNING (Using fallback video):", uploadError?.message || uploadError);
      const base64Data = req.file.buffer.toString("base64");
      videoUrl = `data:${req.file.mimetype || "video/mp4"};base64,${base64Data}`;
    }

    const newFood = await foodModel.create({
      name: foodName,
      video: videoUrl,
      description: description || "",
      price: Number(price) || 0,
      category: category || "General",
      foodPartner: req.foodPartner._id,
    });

    await newFood.populate("foodPartner", "fullName email");

    res.status(201).json({
      message: "Food item created successfully",
      food: newFood,
    });
  } catch (error) {
    console.error("FOOD CREATE ERROR:", error);
    res.status(500).json({
      message: "Server error while creating food item",
    });
  }
}

async function getAllFood(req, res) {
  try {
    const foods = await foodModel
      .find()
      .populate("foodPartner", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Food items retrieved successfully",
      foods,
    });
  } catch (error) {
    console.error("GET ALL FOOD ERROR:", error);
    res.status(500).json({
      message: "Server error while fetching food items",
    });
  }
}

async function getPartnerFood(req, res) {
  try {
    const foods = await foodModel
      .find({ foodPartner: req.foodPartner._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Partner food items retrieved successfully",
      foods,
    });
  } catch (error) {
    console.error("GET PARTNER FOOD ERROR:", error);
    res.status(500).json({
      message: "Server error while fetching partner food items",
    });
  }
}

async function deleteFood(req, res) {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (food.foodPartner.toString() !== req.foodPartner._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this food item" });
    }

    await foodModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("DELETE FOOD ERROR:", error);
    res.status(500).json({ message: "Server error while deleting food item" });
  }
}

async function toggleLikeFood(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const hasLiked = food.likes.includes(userId);
    if (hasLiked) {
      food.likes = food.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      food.likesCount = Math.max(0, food.likesCount - 1);
    } else {
      food.likes.push(userId);
      food.likesCount += 1;
    }

    await food.save();

    res.status(200).json({
      message: hasLiked ? "Unliked food item" : "Liked food item",
      likesCount: food.likesCount,
      isLiked: !hasLiked,
    });
  } catch (error) {
    console.error("TOGGLE LIKE ERROR:", error);
    res.status(500).json({ message: "Server error while toggling like" });
  }
}

async function addComment(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const newComment = {
      user: req.user._id,
      userName: req.user.fullName || "Foodie",
      text,
      createdAt: new Date(),
    };

    food.comments.push(newComment);
    await food.save();

    res.status(201).json({
      message: "Comment added successfully",
      comments: food.comments,
    });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    res.status(500).json({ message: "Server error while adding comment" });
  }
}

async function toggleSaveFood(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const hasSaved = food.saves ? food.saves.includes(userId) : false;
    if (hasSaved) {
      food.saves = food.saves.filter((id) => id.toString() !== userId.toString());
    } else {
      if (!food.saves) food.saves = [];
      food.saves.push(userId);
    }

    await food.save();

    res.status(200).json({
      message: hasSaved ? "Removed from saved reels" : "Saved food reel",
      isSaved: !hasSaved,
    });
  } catch (error) {
    console.error("TOGGLE SAVE ERROR:", error);
    res.status(500).json({ message: "Server error while toggling save" });
  }
}

async function getPartnerPublicProfile(req, res) {
  try {
    const { partnerId } = req.params;
    const foodPartnerModel = require("../models/foodpartner.model");

    const partner = await foodPartnerModel.findById(partnerId).select("-password");
    if (!partner) {
      return res.status(404).json({ message: "Food partner not found" });
    }

    const foods = await foodModel.find({ foodPartner: partnerId }).sort({ createdAt: -1 });
    const totalLikes = foods.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);

    res.status(200).json({
      partner,
      foods,
      totalLikes,
      totalReels: foods.length,
    });
  } catch (error) {
    console.error("GET PARTNER PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error while fetching partner profile" });
  }
}

module.exports = {
  createFood,
  getAllFood,
  getPartnerFood,
  deleteFood,
  toggleLikeFood,
  addComment,
  toggleSaveFood,
  getPartnerPublicProfile,
};
