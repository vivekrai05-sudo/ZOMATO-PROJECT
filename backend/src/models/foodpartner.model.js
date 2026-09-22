const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const foodPartnerModel = mongoose.models.FoodPartner || mongoose.model("FoodPartner", foodPartnerSchema);

module.exports = foodPartnerModel;
