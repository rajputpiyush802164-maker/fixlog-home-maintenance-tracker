const router = require('express').Router();
const mongoose = require('mongoose');
const { Appliance, Repair, Maintenance, Technician } = require('../models');

const sum = (arr) => arr[0]?.t || 0;

router.get('/', async (req, res, next) => {
  try {
    const user = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const in60 = new Date(now.getTime() + 60 * 864e5), in30 = new Date(now.getTime() + 30 * 864e5);
    const since = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [appliances, technicians, statusAgg, maint, completed, recent, warranty, due, allMaint, allRep] = await Promise.all([
      Appliance.countDocuments({ user }), Technician.countDocuments({ user }),
      Repair.aggregate([{ $match: { user } }, { $group: { _id: '$status', n: { $sum: 1 } } }]),
      Maintenance.find({ user, date: { $gte: since } }).lean(),
      Repair.find({ user, status: 'Completed', updatedAt: { $gte: since } }).lean(),
      Repair.find({ user }).populate('appliance', 'name').sort('-createdAt').limit(5).lean(),
      Appliance.find({ user, warrantyUntil: { $gte: now, $lte: in60 } }).sort('warrantyUntil').lean(),
      Maintenance.find({ user, nextDue: { $gte: now, $lte: in30 } }).populate('appliance', 'name').sort('nextDue').lean(),
      Maintenance.aggregate([{ $match: { user } }, { $group: { _id: null, t: { $sum: '$cost' } } }]),
      Repair.aggregate([{ $match: { user, status: 'Completed' } }, { $group: { _id: null, t: { $sum: '$cost' } } }]),
    ]);

    const byStatus = { Requested: 0, Assigned: 0, 'In Progress': 0, Completed: 0 };
    statusAgg.forEach((s) => (byStatus[s._id] = s.n));

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: d.toLocaleString('en', { month: 'short' }), maintenance: 0, repairs: 0 });
    }
    const add = (date, field, v) => {
      const d = new Date(date);
      const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (m) m[field] += v || 0;
    };
    maint.forEach((m) => add(m.date, 'maintenance', m.cost));
    completed.forEach((r) => add(r.updatedAt, 'repairs', r.cost));

    res.json({
      counts: { appliances, technicians, openRepairs: byStatus.Requested + byStatus.Assigned + byStatus['In Progress'] },
      totalSpent: sum(allMaint) + sum(allRep),
      byStatus,
      monthly: months.map(({ key, ...m }) => m),
      recent,
      reminders: [
        ...warranty.map((a) => ({ type: 'warranty', title: `${a.name} warranty ends`, date: a.warrantyUntil })),
        ...due.map((m) => ({ type: 'service', title: `${m.title}${m.appliance ? ' · ' + m.appliance.name : ''}`, date: m.nextDue })),
      ].sort((a, b) => new Date(a.date) - new Date(b.date)),
    });
  } catch (e) { next(e); }
});
module.exports = router;
