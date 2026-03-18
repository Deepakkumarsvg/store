const express = require('express');
const router = express.Router();
const RawMaterialStock = require('../models/RawMaterialStock');
const FinishedGood = require('../models/FinishedGood');
const Production = require('../models/Production');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [rawMaterialAgg, finishedGoodsAgg, salesAgg, expensesAgg, productionCount, purchasesCount] = await Promise.all([
      RawMaterialStock.aggregate([
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      FinishedGood.aggregate([
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Sale.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Purchase.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Production.countDocuments({ status: 'In Progress' }),
      Purchase.countDocuments(),
    ]);

    const rawMaterialsCount = rawMaterialAgg[0]?.total || 0;
    const finishedGoodsCount = finishedGoodsAgg[0]?.total || 0;
    const totalSales = salesAgg[0]?.total || 0;
    const totalExpenses = expensesAgg[0]?.total || 0;
    const profit = totalSales - totalExpenses;
    
    return res.success({
      data: {
        rawMaterials: rawMaterialsCount,
        inProduction: productionCount,
        finishedGoods: finishedGoodsCount,
        totalSales: `₹${(totalSales / 100000).toFixed(1)}L`,
        purchases: purchasesCount,
        profit: `₹${(profit / 100000).toFixed(1)}L`,
      },
    });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

module.exports = router;

