const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateProduct } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');

router.use(protect);

const buildSku = (name = '') => {
  const normalizedName = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 12) || 'PRODUCT';

  const uniqueSuffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  return `${normalizedName}-${uniqueSuffix}`;
};

const normalizeProductPayload = (body = {}) => {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const unit = typeof body.unit === 'string' ? body.unit.trim() : '';
  const sku = typeof body.sku === 'string' ? body.sku.trim() : '';

  return {
    ...body,
    name,
    unit,
    price: Number(body.price),
    sku,
  };
};

// GET all products
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    return res.success({ data: products, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single product
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.fail({ statusCode: 404, message: 'Product not found' });
    }
    return res.success({ data: product });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE product
router.post('/', authorize('admin', 'manager'), validateProduct(), async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);
    const product = await Product.create({
      ...payload,
      sku: payload.sku || buildSku(payload.name),
    });
    return res.success({ statusCode: 201, data: product });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE product
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateProduct(true), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      normalizeProductPayload(req.body),
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.fail({ statusCode: 404, message: 'Product not found' });
    }
    return res.success({ data: product });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE product
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.fail({ statusCode: 404, message: 'Product not found' });
    }
    return res.success({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

