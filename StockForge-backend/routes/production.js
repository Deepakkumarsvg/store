const express = require('express');
const router = express.Router();
const Production = require('../models/Production');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam, validateProduction } = require('../middleware/validation');
const { getPagination, buildPagination } = require('../utils/pagination');
const { ensureCounterFloor, extractSuffixNumber, getNextSequence } = require('../utils/sequence');

router.use(protect);

// GET all production jobs
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [productions, total] = await Promise.all([
      Production.find()
        .populate('product', 'name')
        .populate('rawMaterialsUsed.material', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Production.countDocuments(),
    ]);

    return res.success({ data: productions, pagination: buildPagination(page, limit, total) });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// GET single production job
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const production = await Production.findById(req.params.id)
      .populate('product')
      .populate('rawMaterialsUsed.material');
    if (!production) {
      return res.fail({ statusCode: 404, message: 'Production job not found' });
    }
    return res.success({ data: production });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// CREATE production job
router.post('/', authorize('admin', 'manager'), validateProduction(), async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const prefix = `JOB-${year}-`;
    const latestProduction = await Production.findOne({ jobNumber: { $regex: `^${prefix}` } })
      .sort({ jobNumber: -1 })
      .select('jobNumber');

    const currentMax = extractSuffixNumber(latestProduction?.jobNumber, prefix);
    const sequenceKey = `production-${year}`;
    await ensureCounterFloor(sequenceKey, currentMax);
    const sequence = await getNextSequence(sequenceKey);
    const jobNumber = `JOB-${year}-${String(sequence).padStart(4, '0')}`;
    
    const productionData = {
      ...req.body,
      jobNumber,
    };
    
    const production = await Production.create(productionData);
    return res.success({ statusCode: 201, data: production });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// UPDATE production job
router.put('/:id', authorize('admin', 'manager'), validateIdParam, validateProduction(true), async (req, res) => {
  try {
    const production = await Production.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('product').populate('rawMaterialsUsed.material');
    
    if (!production) {
      return res.fail({ statusCode: 404, message: 'Production job not found' });
    }
    return res.success({ data: production });
  } catch (error) {
    return res.fail({ statusCode: 400, message: error.message });
  }
});

// DELETE production job
router.delete('/:id', authorize('admin'), validateIdParam, async (req, res) => {
  try {
    const production = await Production.findByIdAndDelete(req.params.id);
    if (!production) {
      return res.fail({ statusCode: 404, message: 'Production job not found' });
    }
    return res.success({ message: 'Production job deleted successfully' });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

