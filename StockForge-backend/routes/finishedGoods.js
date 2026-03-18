const express = require('express');
const router = express.Router();
const FinishedGood = require('../models/FinishedGood');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateFinishedGood } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');

router.use(protect);

// GET all finished goods
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [goods, total] = await Promise.all([
      FinishedGood.find()
        .populate('product', 'name sku unit price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FinishedGood.countDocuments(),
    ]);

    return res.success({ data: goods, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single finished good
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const good = await FinishedGood.findById(req.params.id).populate('product');
    if (!good) {
      return res.fail({ statusCode: 404, message: 'Finished good not found' });
    }
    return res.success({ data: good });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE/UPDATE finished good stock
router.post('/', authorize('admin', 'manager'), validateFinishedGood(), async (req, res) => {
  try {
    const { product, quantity } = req.body;
    
    // Check if stock exists for this product
    let good = await FinishedGood.findOne({ product });
    
    if (good) {
      // Update existing stock
      good.quantity += Number(quantity);
      await good.save();
    } else {
      // Create new stock entry
      good = await FinishedGood.create(req.body);
    }
    
    return res.success({ statusCode: 201, data: good });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE finished good
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateFinishedGood(true), async (req, res) => {
  try {
    const good = await FinishedGood.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product');
    
    if (!good) {
      return res.fail({ statusCode: 404, message: 'Finished good not found' });
    }
    return res.success({ data: good });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE finished good
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const good = await FinishedGood.findByIdAndDelete(req.params.id);
    if (!good) {
      return res.fail({ statusCode: 404, message: 'Finished good not found' });
    }
    return res.success({ message: 'Finished good deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

