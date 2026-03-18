const mongoose = require('mongoose');

const isProvided = (value) => value !== undefined && value !== null;
const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const failValidation = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
};

const validateIdParam = (req, res, next) => {
  if (!isObjectId(req.params.id)) {
    return failValidation(res, ['Invalid id parameter']);
  }

  next();
};

const validateProduct = (partial = false) => (req, res, next) => {
  const { name, type, unit, price, sku } = req.body;
  const errors = [];

  if (!partial || isProvided(name)) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters long');
    }
  }

  if (!partial || isProvided(type)) {
    const allowedTypes = ['Raw Material', 'Finished Good'];
    if (!allowedTypes.includes(type)) {
      errors.push('Type must be Raw Material or Finished Good');
    }
  }

  if (!partial || isProvided(unit)) {
    if (typeof unit !== 'string' || unit.trim().length < 1) {
      errors.push('Unit is required');
    }
  }

  if (!partial || isProvided(price)) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (isProvided(sku) && typeof sku !== 'string') {
    errors.push('SKU must be a string');
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

const validateParty = (partial = false) => (req, res, next) => {
  const { name, contact, email, status, gst } = req.body;
  const errors = [];

  if (!partial || isProvided(name)) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name is required and must be at least 2 characters long');
    }
  }

  if (!partial || isProvided(contact)) {
    if (typeof contact !== 'string' || contact.trim().length < 5) {
      errors.push('Contact is required and must be at least 5 characters long');
    }
  }

  if (!partial || isProvided(email)) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.push('Valid email is required');
    }
  }

  if (isProvided(status) && !['Active', 'Inactive'].includes(status)) {
    errors.push('Status must be Active or Inactive');
  }

  if (isProvided(gst) && typeof gst !== 'string') {
    errors.push('GST must be a string');
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

const validateUnit = (partial = false) => (req, res, next) => {
  const { name, shortForm } = req.body;
  const errors = [];

  if (!partial || isProvided(name)) {
    if (typeof name !== 'string' || name.trim().length < 1) {
      errors.push('Unit name is required');
    }
  }

  if (!partial || isProvided(shortForm)) {
    if (typeof shortForm !== 'string' || shortForm.trim().length < 1) {
      errors.push('Unit short form is required');
    }
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

const validatePurchase = (partial = false) => (req, res, next) => {
  const { supplier, items, totalAmount, status } = req.body;
  const errors = [];

  if (!partial || isProvided(supplier)) {
    if (!isObjectId(supplier)) {
      errors.push('Supplier must be a valid id');
    }
  }

  if (!partial || isProvided(items)) {
    if (!Array.isArray(items) || items.length === 0) {
      errors.push('Items must be a non-empty array');
    } else {
      items.forEach((item, index) => {
        if (!isObjectId(item.product)) {
          errors.push(`Items[${index}] product must be a valid id`);
        }
        if (typeof item.quantity !== 'number' || Number.isNaN(item.quantity) || item.quantity < 0) {
          errors.push(`Items[${index}] quantity must be a non-negative number`);
        }
        if (typeof item.rate !== 'number' || Number.isNaN(item.rate) || item.rate < 0) {
          errors.push(`Items[${index}] rate must be a non-negative number`);
        }
      });
    }
  }

  if (!partial || isProvided(totalAmount)) {
    if (typeof totalAmount !== 'number' || Number.isNaN(totalAmount) || totalAmount < 0) {
      errors.push('Total amount must be a non-negative number');
    }
  }

  if (isProvided(status) && !['Pending', 'Received', 'Cancelled'].includes(status)) {
    errors.push('Status must be Pending, Received or Cancelled');
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

const validateSale = (partial = false) => (req, res, next) => {
  const { customer, items, totalAmount, status } = req.body;
  const errors = [];

  if (!partial || isProvided(customer)) {
    if (!isObjectId(customer)) {
      errors.push('Customer must be a valid id');
    }
  }

  if (!partial || isProvided(items)) {
    if (!Array.isArray(items) || items.length === 0) {
      errors.push('Items must be a non-empty array');
    } else {
      items.forEach((item, index) => {
        if (!isObjectId(item.product)) {
          errors.push(`Items[${index}] product must be a valid id`);
        }
        if (typeof item.quantity !== 'number' || Number.isNaN(item.quantity) || item.quantity < 0) {
          errors.push(`Items[${index}] quantity must be a non-negative number`);
        }
        if (typeof item.price !== 'number' || Number.isNaN(item.price) || item.price < 0) {
          errors.push(`Items[${index}] price must be a non-negative number`);
        }
      });
    }
  }

  if (!partial || isProvided(totalAmount)) {
    if (typeof totalAmount !== 'number' || Number.isNaN(totalAmount) || totalAmount < 0) {
      errors.push('Total amount must be a non-negative number');
    }
  }

  if (isProvided(status) && !['Pending', 'Dispatched', 'Delivered', 'Cancelled'].includes(status)) {
    errors.push('Status must be Pending, Dispatched, Delivered or Cancelled');
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

const validateProduction = (partial = false) => (req, res, next) => {
  const { product, quantity, startDate, status, rawMaterialsUsed } = req.body;
  const errors = [];

  if (!partial || isProvided(product)) {
    if (!isObjectId(product)) {
      errors.push('Product must be a valid id');
    }
  }

  if (!partial || isProvided(quantity)) {
    if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }
  }

  if (!partial || isProvided(startDate)) {
    if (Number.isNaN(Date.parse(startDate))) {
      errors.push('Start date must be a valid date');
    }
  }

  if (isProvided(rawMaterialsUsed)) {
    if (!Array.isArray(rawMaterialsUsed)) {
      errors.push('Raw materials used must be an array');
    } else {
      rawMaterialsUsed.forEach((item, index) => {
        if (isProvided(item.material) && !isObjectId(item.material)) {
          errors.push(`RawMaterialsUsed[${index}] material must be a valid id`);
        }
        if (isProvided(item.quantity) && (typeof item.quantity !== 'number' || Number.isNaN(item.quantity) || item.quantity < 0)) {
          errors.push(`RawMaterialsUsed[${index}] quantity must be a non-negative number`);
        }
      });
    }
  }

  if (isProvided(status) && !['In Progress', 'Completed', 'Cancelled'].includes(status)) {
    errors.push('Status must be In Progress, Completed or Cancelled');
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

const validateRawMaterialStock = (partial = false) => (req, res, next) => {
  const { material, quantity, minLevel, maxLevel } = req.body;
  const errors = [];

  if (!partial || isProvided(material)) {
    if (!isObjectId(material)) {
      errors.push('Material must be a valid id');
    }
  }

  if (!partial || isProvided(quantity)) {
    if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }
  }

  if (isProvided(minLevel) && (typeof minLevel !== 'number' || Number.isNaN(minLevel) || minLevel < 0)) {
    errors.push('Min level must be a non-negative number');
  }

  if (isProvided(maxLevel) && (typeof maxLevel !== 'number' || Number.isNaN(maxLevel) || maxLevel < 0)) {
    errors.push('Max level must be a non-negative number');
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

const validateFinishedGood = (partial = false) => (req, res, next) => {
  const { product, quantity, minLevel, maxLevel } = req.body;
  const errors = [];

  if (!partial || isProvided(product)) {
    if (!isObjectId(product)) {
      errors.push('Product must be a valid id');
    }
  }

  if (!partial || isProvided(quantity)) {
    if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }
  }

  if (isProvided(minLevel) && (typeof minLevel !== 'number' || Number.isNaN(minLevel) || minLevel < 0)) {
    errors.push('Min level must be a non-negative number');
  }

  if (isProvided(maxLevel) && (typeof maxLevel !== 'number' || Number.isNaN(maxLevel) || maxLevel < 0)) {
    errors.push('Max level must be a non-negative number');
  }

  if (errors.length > 0) {
    return failValidation(res, errors);
  }

  next();
};

module.exports = {
  validateIdParam,
  validateProduct,
  validateParty,
  validateUnit,
  validatePurchase,
  validateSale,
  validateProduction,
  validateRawMaterialStock,
  validateFinishedGood,
};
