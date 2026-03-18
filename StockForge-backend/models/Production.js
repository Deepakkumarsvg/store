const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  jobNumber: {
    type: String,
    required: true,
    unique: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  rawMaterialsUsed: [{
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Cancelled'],
    default: 'In Progress',
  },
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Production', productionSchema);
