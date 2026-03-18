const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect, authorize } = require('../middleware/auth');
const { validateIdParam } = require('../middleware/validation');

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const validateCreatePayload = (payload) => {
  const errors = [];

  const name = sanitizeText(payload.name);
  const phone = sanitizeText(payload.phone);
  const email = sanitizeText(payload.email).toLowerCase();
  const message = sanitizeText(payload.message);

  if (name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (phone.length < 6) {
    errors.push('Phone must be at least 6 characters long');
  }

  if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (message.length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  return {
    errors,
    sanitized: {
      name,
      phone,
      email,
      message,
      source: sanitizeText(payload.source) || 'landing-page',
    },
  };
};

// Public: submit enquiry from landing page
router.post('/', async (req, res) => {
  try {
    const { errors, sanitized } = validateCreatePayload(req.body || {});

    if (errors.length > 0) {
      return res.fail({ statusCode: 400, message: 'Validation failed', errors });
    }

    const enquiry = await Enquiry.create(sanitized);

    return res.success({
      statusCode: 201,
      message: 'Enquiry submitted successfully',
      data: {
        id: enquiry._id,
        status: enquiry.status,
      },
    });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// Protected: list enquiries for admin/manager
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const status = sanitizeText(req.query.status);
    const search = sanitizeText(req.query.search);
    const fromDate = sanitizeText(req.query.fromDate);
    const toDate = sanitizeText(req.query.toDate);

    const filters = {};

    if (['New', 'Contacted', 'Closed'].includes(status)) {
      filters.status = status;
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      filters.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { phone: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { message: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    if (fromDate || toDate) {
      const createdAt = {};

      if (fromDate) {
        const start = new Date(`${fromDate}T00:00:00.000Z`);
        if (!Number.isNaN(start.getTime())) {
          createdAt.$gte = start;
        }
      }

      if (toDate) {
        const end = new Date(`${toDate}T23:59:59.999Z`);
        if (!Number.isNaN(end.getTime())) {
          createdAt.$lte = end;
        }
      }

      if (Object.keys(createdAt).length > 0) {
        filters.createdAt = createdAt;
      }
    }

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Enquiry.countDocuments(filters),
    ]);

    const [newCount, contactedCount, closedCount] = await Promise.all([
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: 'Contacted' }),
      Enquiry.countDocuments({ status: 'Closed' }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.success({
      data: enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      meta: {
        counts: {
          total: newCount + contactedCount + closedCount,
          new: newCount,
          contacted: contactedCount,
          closed: closedCount,
        },
      },
    });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// Protected: update enquiry status (New -> Contacted -> Closed)
router.put('/:id/status', protect, authorize('admin', 'manager'), validateIdParam, async (req, res) => {
  try {
    const allowedStatuses = ['New', 'Contacted', 'Closed'];
    const nextStatus = sanitizeText(req.body?.status);

    if (!allowedStatuses.includes(nextStatus)) {
      return res.fail({ statusCode: 400, message: 'Status must be New, Contacted, or Closed' });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status: nextStatus },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.fail({ statusCode: 404, message: 'Enquiry not found' });
    }

    return res.success({
      message: 'Enquiry status updated successfully',
      data: enquiry,
    });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

