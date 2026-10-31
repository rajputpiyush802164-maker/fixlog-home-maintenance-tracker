const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const ref = (m) => ({ type: Schema.Types.ObjectId, ref: m });
const opts = { timestamps: true };

const User = model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
}, opts));

const Appliance = model('Appliance', new Schema({
  user: { ...ref('User'), required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'Other' },
  brand: String, model: String, location: String, notes: String,
  purchaseDate: Date, warrantyUntil: Date,
}, opts));

const Technician = model('Technician', new Schema({
  user: { ...ref('User'), required: true },
  name: { type: String, required: true, trim: true },
  specialty: { type: String, default: 'General' },
  phone: String, email: String,
  rating: { type: Number, min: 1, max: 5, default: 4 },
}, opts));

const Repair = model('Repair', new Schema({
  user: { ...ref('User'), required: true },
  appliance: ref('Appliance'), technician: ref('Technician'),
  title: { type: String, required: true, trim: true },
  description: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Requested', 'Assigned', 'In Progress', 'Completed'], default: 'Requested' },
  cost: { type: Number, default: 0, min: 0 },
  scheduledDate: Date,
}, opts));

const Maintenance = model('Maintenance', new Schema({
  user: { ...ref('User'), required: true },
  appliance: ref('Appliance'),
  title: { type: String, required: true, trim: true },
  type: { type: String, default: 'Service' },
  cost: { type: Number, default: 0, min: 0 },
  date: { type: Date, default: Date.now },
  nextDue: Date,
}, opts));

module.exports = { User, Appliance, Technician, Repair, Maintenance };
