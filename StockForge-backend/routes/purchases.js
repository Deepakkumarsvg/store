const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validatePurchase } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');
const { ensureCounterFloor, extractSuffixNumber, getNextSequence } = require('../utils/sequence');

router.use(protect);

// GET all purchases
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [purchases, total] = await Promise.all([
      Purchase.find()
        .populate('supplier', 'name')
        .populate('items.product', 'name sku')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Purchase.countDocuments(),
    ]);

    return res.success({ data: purchases, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single purchase
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('supplier')
      .populate('items.product');
    if (!purchase) {
      return res.fail({ statusCode: 404, message: 'Purchase not found' });
    }
    return res.success({ data: purchase });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE purchase
router.post('/', authorize('admin', 'manager'), validatePurchase(), async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const prefix = `PO-${year}-`;
    const latestPurchase = await Purchase.findOne({ poNumber: { $regex: `^${prefix}` } })
      .sort({ poNumber: -1 })
      .select('poNumber');

    const currentMax = extractSuffixNumber(latestPurchase?.poNumber, prefix);
    const sequenceKey = `purchase-${year}`;
    await ensureCounterFloor(sequenceKey, currentMax);
    const sequence = await getNextSequence(sequenceKey);
    const poNumber = `PO-${year}-${String(sequence).padStart(4, '0')}`;
    
    const purchaseData = {
      ...req.body,
      poNumber,
    };
    
    const purchase = await Purchase.create(purchaseData);
    return res.success({ statusCode: 201, data: purchase });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE purchase
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validatePurchase(true), async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('supplier').populate('items.product');
    
    if (!purchase) {
      return res.fail({ statusCode: 404, message: 'Purchase not found' });
    }
    return res.success({ data: purchase });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE purchase
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.fail({ statusCode: 404, message: 'Purchase not found' });
    }
    return res.success({ message: 'Purchase deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

