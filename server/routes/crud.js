const express = require('express');
const mongoose = require('mongoose');

// Generic CRUD: har record sirf logged-in user ka hota hai
module.exports = (Model, { populate = '', search = ['name'], filters = [], sort = '-createdAt' } = {}) => {
  const r = express.Router();
  const validId = (req, res, next) =>
    mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ message: 'Invalid id' });
  const clean = (b) => {
    const { _id, user, createdAt, updatedAt, __v, ...rest } = b;
    Object.keys(rest).forEach((k) => { if (rest[k] === '' || rest[k] === null) rest[k] = undefined; });
    return rest;
  };

  r.get('/', async (req, res, next) => {
    try {
      const q = { user: req.userId };
      filters.forEach((f) => { if (req.query[f]) q[f] = req.query[f]; });
      if (req.query.q) {
        const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        q.$or = search.map((f) => ({ [f]: rx }));
      }
      res.json(await Model.find(q).populate(populate).sort(sort));
    } catch (e) { next(e); }
  });
  r.post('/', async (req, res, next) => {
    try {
      const doc = await Model.create({ ...clean(req.body), user: req.userId });
      res.status(201).json(await doc.populate(populate));
    } catch (e) { next(e); }
  });
  r.put('/:id', validId, async (req, res, next) => {
    try {
      const doc = await Model.findOneAndUpdate({ _id: req.params.id, user: req.userId }, clean(req.body), { new: true, runValidators: true }).populate(populate);
      doc ? res.json(doc) : res.status(404).json({ message: 'Not found' });
    } catch (e) { next(e); }
  });
  r.delete('/:id', validId, async (req, res, next) => {
    try {
      const doc = await Model.findOneAndDelete({ _id: req.params.id, user: req.userId });
      doc ? res.json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' });
    } catch (e) { next(e); }
  });
  return r;
};
