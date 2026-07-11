const WebsiteAnalytics = require('../models/WebsiteAnalytics');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/analytics/visit
// Record a visitor landing on the homepage
const recordVisit = asyncHandler(async (req, res) => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // 1-12
  const year = today.getFullYear();
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Atomic database increment operation with upsert: true
  const record = await WebsiteAnalytics.findOneAndUpdate(
    { day, month, year },
    {
      $inc: { count: 1 },
      $setOnInsert: { date: dateStr },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    success: true,
    count: record.count,
  });
});

// GET /api/admin/analytics
// Retrieve visitor statistics (today, thisMonth, thisYear, total)
const getAnalytics = asyncHandler(async (req, res) => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  // Run database aggregation/find queries in parallel for peak performance
  const [todayRecord, monthlyData, yearlyData, totalData] = await Promise.all([
    WebsiteAnalytics.findOne({ day, month, year }),
    WebsiteAnalytics.aggregate([
      { $match: { month, year } },
      { $group: { _id: null, total: { $sum: '$count' } } },
    ]),
    WebsiteAnalytics.aggregate([
      { $match: { year } },
      { $group: { _id: null, total: { $sum: '$count' } } },
    ]),
    WebsiteAnalytics.aggregate([
      { $group: { _id: null, total: { $sum: '$count' } } },
    ]),
  ]);

  const todayCount = todayRecord ? todayRecord.count : 0;
  const monthCount = monthlyData.length > 0 ? monthlyData[0].total : 0;
  const yearCount = yearlyData.length > 0 ? yearlyData[0].total : 0;
  const totalCount = totalData.length > 0 ? totalData[0].total : 0;

  res.status(200).json({
    today: todayCount,
    thisMonth: monthCount,
    thisYear: yearCount,
    totalVisitors: totalCount,
  });
});

module.exports = {
  recordVisit,
  getAnalytics,
};
