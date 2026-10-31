const mongoose = require('mongoose');
const { Repair } = require('../models');
const crud = require('./crud');

const FLOW = ['Requested', 'Assigned', 'In Progress', 'Completed'];
const router = crud(Repair, { populate: 'appliance technician', search: ['title', 'description'], filters: ['status', 'priority'] });

// Workflow: Requested -> Assigned -> In Progress -> Completed (sirf aage badh sakta hai)
router.patch('/:id/status', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid id' });
    const repair = await Repair.findOne({ _id: req.params.id, user: req.userId });
    if (!repair) return res.status(404).json({ message: 'Not found' });
    const target = req.body.status || FLOW[FLOW.indexOf(repair.status) + 1];
    if (!FLOW.includes(target)) return res.status(400).json({ message: 'Invalid status' });
    if (FLOW.indexOf(target) <= FLOW.indexOf(repair.status)) return res.status(409).json({ message: `Already ${repair.status}` });
    if (target !== 'Requested' && !repair.technician) return res.status(409).json({ message: 'Assign a technician first (edit the repair)' });
    repair.status = target;
    await repair.save();
    res.json(await repair.populate('appliance technician'));
  } catch (e) { next(e); }
});
module.exports = router;
