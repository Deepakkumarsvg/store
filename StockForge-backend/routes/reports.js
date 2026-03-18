const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Production = require('../models/Production');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET financial reports
router.get('/', async (req, res) => {
  try {
    const [salesAgg, expensesAgg, productionCount] = await Promise.all([
      Sale.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Purchase.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Production.countDocuments({ status: 'In Progress' }),
    ]);

    const totalRevenue = salesAgg[0]?.total || 0;
    const totalExpenses = expensesAgg[0]?.total || 0;
    
    // Calculate profit
    const netProfit = totalRevenue - totalExpenses;

    // Monthly data (simplified - last 3 months)
    const monthlyData = await getMonthlyData();
    
    return res.success({
      data: {
        summary: {
          totalRevenue,
          totalExpenses,
          netProfit,
          productionCount,
        },
        monthlyData,
      },
    });
  } catch (error) {
    return res.fail({ statusCode: 500, message: error.message });
  }
});

// Helper function to get monthly data
async function getMonthlyData() {
  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const windowEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [salesByMonth, expensesByMonth] = await Promise.all([
    Sale.aggregate([
      { $match: { status: { $ne: 'Cancelled' }, date: { $gte: windowStart, $lt: windowEnd } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$totalAmount' },
        },
      },
    ]),
    Purchase.aggregate([
      { $match: { status: { $ne: 'Cancelled' }, date: { $gte: windowStart, $lt: windowEnd } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          total: { $sum: '$totalAmount' },
        },
      },
    ]),
  ]);

  const salesMap = new Map(
    salesByMonth.map((entry) => [`${entry._id.year}-${entry._id.month}`, entry.total])
  );
  const expensesMap = new Map(
    expensesByMonth.map((entry) => [`${entry._id.year}-${entry._id.month}`, entry.total])
  );

  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
  const data = [];

  for (let i = 2; i >= 0; i -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
    const revenue = salesMap.get(key) || 0;
    const expenses = expensesMap.get(key) || 0;

    data.push({
      month: formatter.format(monthDate),
      revenue,
      expenses,
      profit: revenue - expenses,
    });
  }

  return data;
}

module.exports = router;

