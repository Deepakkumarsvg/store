const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Raw Material', 'Finished Good'],
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sku: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
    default: 'General',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
