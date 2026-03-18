const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateParty } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');

router.use(protect);

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [suppliers, total] = await Promise.all([
      Supplier.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Supplier.countDocuments(),
    ]);

    return res.success({ data: suppliers, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single supplier
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.fail({ statusCode: 404, message: 'Supplier not found' });
    }
    return res.success({ data: supplier });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE supplier
router.post('/', authorize('admin', 'manager'), validateParty(), async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    return res.success({ statusCode: 201, data: supplier });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE supplier
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateParty(true), async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res.fail({ statusCode: 404, message: 'Supplier not found' });
    }
    return res.success({ data: supplier });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE supplier
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.fail({ statusCode: 404, message: 'Supplier not found' });
    }
    return res.success({ message: 'Supplier deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

