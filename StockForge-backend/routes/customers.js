const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateParty } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');

router.use(protect);

// GET all customers
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [customers, total] = await Promise.all([
      Customer.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Customer.countDocuments(),
    ]);

    return res.success({ data: customers, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single customer
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.fail({ statusCode: 404, message: 'Customer not found' });
    }
    return res.success({ data: customer });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE customer
router.post('/', authorize('admin', 'manager'), validateParty(), async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    return res.success({ statusCode: 201, data: customer });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE customer
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateParty(true), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.fail({ statusCode: 404, message: 'Customer not found' });
    }
    return res.success({ data: customer });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE customer
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.fail({ statusCode: 404, message: 'Customer not found' });
    }
    return res.success({ message: 'Customer deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

