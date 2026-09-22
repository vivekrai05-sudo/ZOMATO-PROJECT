//ROUTES SE CONNECTED RHEGA
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* ================= USER AUTH ================= */

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}

/* ================= FOOD PARTNER AUTH ================= */

async function registerFoodPartner(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExists) {
      return res.status(400).json({ message: "Food partner already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: foodPartner._id, role: "foodpartner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("partnerToken", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Food partner registered successfully",
      token,
      foodPartner: {
        _id: foodPartner._id,
        fullName: foodPartner.fullName,
        email: foodPartner.email,
        role: "foodpartner",
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner)
      return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: foodPartner._id, role: "foodpartner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("partnerToken", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      foodPartner: {
        _id: foodPartner._id,
        fullName: foodPartner.fullName,
        email: foodPartner.email,
        role: "foodpartner",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

function logoutFoodPartner(req, res) {
  res.clearCookie("partnerToken");
  res.status(200).json({
    message: "Food partner logged out successfully",
  });
}

function getUserMe(req, res) {
  res.status(200).json({
    user: {
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: "user",
    },
  });
}

function getFoodPartnerMe(req, res) {
  res.status(200).json({
    foodPartner: {
      _id: req.foodPartner._id,
      fullName: req.foodPartner.fullName,
      email: req.foodPartner.email,
      role: "foodpartner",
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserMe,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getFoodPartnerMe,
};
