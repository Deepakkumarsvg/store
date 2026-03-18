const mongoose = require('mongoose');

const rawMaterialStockSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  minLevel: {
    type: Number,
    default: 0,
  },
  maxLevel: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    default: 'Main Warehouse',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('RawMaterialStock', rawMaterialStockSchema);
