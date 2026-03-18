const express = require('express');
const router = express.Router();
const RawMaterialStock = require('../models/RawMaterialStock');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateRawMaterialStock } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');

router.use(protect);

// GET all raw materials
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [stocks, total] = await Promise.all([
      RawMaterialStock.find()
        .populate('material', 'name unit')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      RawMaterialStock.countDocuments(),
    ]);

    return res.success({ data: stocks, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single raw material stock
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const stock = await RawMaterialStock.findById(req.params.id).populate('material');
    if (!stock) {
      return res.fail({ statusCode: 404, message: 'Stock not found' });
    }
    return res.success({ data: stock });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE/UPDATE raw material stock
router.post('/', authorize('admin', 'manager'), validateRawMaterialStock(), async (req, res) => {
  try {
    const { material, quantity } = req.body;
    
    // Check if stock exists for this material
    let stock = await RawMaterialStock.findOne({ material });
    
    if (stock) {
      // Update existing stock
      stock.quantity += Number(quantity);
      await stock.save();
    } else {
      // Create new stock entry
      stock = await RawMaterialStock.create(req.body);
    }
    
    return res.success({ statusCode: 201, data: stock });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE raw material stock
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateRawMaterialStock(true), async (req, res) => {
  try {
    const stock = await RawMaterialStock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('material');
    
    if (!stock) {
      return res.fail({ statusCode: 404, message: 'Stock not found' });
    }
    return res.success({ data: stock });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE raw material stock
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const stock = await RawMaterialStock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.fail({ statusCode: 404, message: 'Stock not found' });
    }
    return res.success({ message: 'Stock deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

