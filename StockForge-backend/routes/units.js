const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateUnit } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');

router.use(protect);

// GET all units
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [units, total] = await Promise.all([
      Unit.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Unit.countDocuments(),
    ]);

    return res.success({ data: units, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single unit
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      return res.fail({ statusCode: 404, message: 'Unit not found' });
    }
    return res.success({ data: unit });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE unit
router.post('/', authorize('admin', 'manager'), validateUnit(), async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    return res.success({ statusCode: 201, data: unit });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE unit
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateUnit(true), async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!unit) {
      return res.fail({ statusCode: 404, message: 'Unit not found' });
    }
    return res.success({ data: unit });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE unit
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) {
      return res.fail({ statusCode: 404, message: 'Unit not found' });
    }
    return res.success({ message: 'Unit deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

