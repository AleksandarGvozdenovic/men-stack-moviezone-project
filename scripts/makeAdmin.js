require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moviezone';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

  
    let email = (process.argv[2] || '').toLowerCase().trim();
    const nameArg = (process.argv.slice(3).join(' ') || '').trim();

    if (!email) {
      console.log('Usage: npm run make:admin -- <email> [Display Name]');
      process.exit(0);
    }

    const update = { role: 'admin' };
    if (nameArg) update.name = nameArg; 
    const user = await User.findOneAndUpdate(
      { email },
      { $set: update },
      { new: true }
    );

    if (!user) {
      console.log('User not found:', email);
    } else {
      console.log(`✅ Promoted to admin: ${user.email}  | name: ${user.name || '(unchanged)'}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
