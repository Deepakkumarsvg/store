const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateSale } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');
const { ensureCounterFloor, extractSuffixNumber, getNextSequence } = require('../utils/sequence');

router.use(protect);

// GET all sales
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [sales, total] = await Promise.all([
      Sale.find()
        .populate('customer', 'name')
        .populate('items.product', 'name sku')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Sale.countDocuments(),
    ]);

    return res.success({ data: sales, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single sale
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('customer')
      .populate('items.product');
    if (!sale) {
      return res.fail({ statusCode: 404, message: 'Sale not found' });
    }
    return res.success({ data: sale });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE sale
router.post('/', authorize('admin', 'manager'), validateSale(), async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    const latestSale = await Sale.findOne({ invoiceNumber: { $regex: `^${prefix}` } })
      .sort({ invoiceNumber: -1 })
      .select('invoiceNumber');

    const currentMax = extractSuffixNumber(latestSale?.invoiceNumber, prefix);
    const sequenceKey = `sale-${year}`;
    await ensureCounterFloor(sequenceKey, currentMax);
    const sequence = await getNextSequence(sequenceKey);
    const invoiceNumber = `INV-${year}-${String(sequence).padStart(4, '0')}`;
    
    const saleData = {
      ...req.body,
      invoiceNumber,
    };
    
    const createdSale = await Sale.create(saleData);
    const sale = await Sale.findById(createdSale._id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name sku');

    return res.success({ statusCode: 201, data: sale });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE sale
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateSale(true), async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer').populate('items.product');
    
    if (!sale) {
      return res.fail({ statusCode: 404, message: 'Sale not found' });
    }
    return res.success({ data: sale });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE sale
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.fail({ statusCode: 404, message: 'Sale not found' });
    }
    return res.success({ message: 'Sale deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

