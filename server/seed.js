require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Appliance, Technician, Repair, Maintenance } = require('./models');

const day = (n) => new Date(Date.now() + n * 864e5);

async function seed() {
  await User.deleteOne({ email: 'demo@fixlog.com' });
  const user = await User.create({ name: 'Demo User', email: 'demo@fixlog.com', password: await bcrypt.hash('demo123', 10) });
  const u = user._id;
  const [ac, fridge, wm, geyser, tv] = await Appliance.insertMany([
    { user: u, name: 'Split AC', category: 'Cooling', brand: 'Daikin', model: 'FTKF35', location: 'Bedroom', purchaseDate: day(-700), warrantyUntil: day(25) },
    { user: u, name: 'Double Door Fridge', category: 'Kitchen', brand: 'LG', model: 'GL-T292', location: 'Kitchen', purchaseDate: day(-1200), warrantyUntil: day(-100) },
    { user: u, name: 'Washing Machine', category: 'Laundry', brand: 'Samsung', model: 'WA70', location: 'Balcony', purchaseDate: day(-300), warrantyUntil: day(400) },
    { user: u, name: 'Water Heater', category: 'Plumbing', brand: 'Havells', model: 'Instanio', location: 'Bathroom', purchaseDate: day(-500), warrantyUntil: day(50) },
    { user: u, name: 'Smart TV', category: 'Electronics', brand: 'Sony', model: 'Bravia X75', location: 'Living room', purchaseDate: day(-200), warrantyUntil: day(600) },
  ]);
  const [t1, t2, t3] = await Technician.insertMany([
    { user: u, name: 'Rajesh Kumar', specialty: 'AC & Cooling', phone: '98765 43210', email: 'rajesh@example.com', rating: 5 },
    { user: u, name: 'Sunil Verma', specialty: 'Electrician', phone: '98123 45678', rating: 4 },
    { user: u, name: 'Amit Plumbing Works', specialty: 'Plumber', phone: '99887 76655', rating: 4 },
  ]);
  await Repair.insertMany([
    { user: u, appliance: ac._id, technician: t1._id, title: 'AC not cooling', description: 'Gas refill needed', priority: 'High', status: 'In Progress', cost: 2500, scheduledDate: day(1) },
    { user: u, appliance: fridge._id, title: 'Fridge making noise', priority: 'Medium', status: 'Requested' },
    { user: u, appliance: geyser._id, technician: t3._id, title: 'Geyser leaking', priority: 'High', status: 'Assigned', scheduledDate: day(2) },
    { user: u, appliance: wm._id, technician: t2._id, title: 'Drain pump replaced', priority: 'Low', status: 'Completed', cost: 1800 },
    { user: u, appliance: tv._id, technician: t2._id, title: 'HDMI port repair', priority: 'Low', status: 'Completed', cost: 900 },
  ]);
  const months = [0, 1, 2, 3, 4, 5];
  await Maintenance.insertMany([
    ...months.map((i) => ({ user: u, appliance: [ac, fridge, wm, geyser][i % 4]._id, title: ['AC service', 'Fridge gas check', 'Drum cleaning', 'Anode rod change'][i % 4], type: 'Service', cost: 600 + i * 220, date: new Date(new Date().getFullYear(), new Date().getMonth() - i, 8), nextDue: i === 0 ? day(12) : undefined })),
  ]);
  console.log('✔ Demo data ready → demo@fixlog.com / demo123');
}
module.exports = seed;

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fixlog', { serverSelectionTimeoutMS: 3000 })
    .then(seed).then(() => process.exit(0))
    .catch((e) => { console.error('Seed failed — MongoDB chalu hai?', e.message); process.exit(1); });
}
