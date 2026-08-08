const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    phone: String,
    email: String,
    openingHours: {
      open: String,
      close: String,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    logo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
