const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  poster: { type: String },
  duration: { type: Number, default: 120 }, 
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
