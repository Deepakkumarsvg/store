const Counter = require('../models/Counter');

const ensureCounterFloor = async (key, floor) => {
  await Counter.findByIdAndUpdate(
    key,
    { $max: { seq: floor } },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

const extractSuffixNumber = (value, prefix) => {
  if (typeof value !== 'string' || !value.startsWith(prefix)) {
    return 0;
  }

  const suffix = value.slice(prefix.length);
  const parsed = Number.parseInt(suffix, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getNextSequence = async (key) => {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return counter.seq;
};

module.exports = {
  ensureCounterFloor,
  extractSuffixNumber,
  getNextSequence,
};
