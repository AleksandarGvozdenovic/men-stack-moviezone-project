const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    qty: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
