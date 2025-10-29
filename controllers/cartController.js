
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Order = require('../models/Order');

// ===================== helpers ==============
function initCart(req) {
  if (!req.session.cart) req.session.cart = { items: [], total: 0 };
  return req.session.cart;
}
function recalc(cart) {
  cart.total = Number(
    cart.items.reduce((sum, i) => sum + Number(i.price) * Number(i.qty), 0).toFixed(2)
  );
  return cart;
}
function parseQty(val) {
  const n = Math.floor(Number(val));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 99);
}

//=====================controller actions =================
exports.index = (req, res) => {
  const cart = initCart(req);
  res.render('cart/index', { title: 'My Cart', cart });
};

exports.add = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    req.flash('error', 'Invalid movie');
    return res.redirect('back');
  }

  const movie = await Movie.findById(id).lean();
  if (!movie || !movie.published) {
    req.flash('error', 'Movie not available');
    return res.redirect('back');
  }

  const qty = parseQty(req.body.qty);
  const cart = initCart(req);

  const existing = cart.items.find(i => String(i.movie) === String(movie._id));
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 99);
    existing.price = Number(movie.price); 
  } else {
    cart.items.push({
      movie: movie._id,
      title: movie.title,
      price: Number(movie.price),
      qty
    });
  }

  recalc(cart);
  req.flash('success', `Added ${movie.title} ×${qty} to cart`);
  res.redirect('/cart');
};

exports.update = (req, res) => {
  const cart = initCart(req);
  const qty = parseQty(req.body.qty);
  const item = cart.items.find(i => String(i.movie) === String(req.params.id));
  if (item) {
    item.qty = qty;
    recalc(cart);
  }
  res.redirect('/cart');
};

exports.remove = (req, res) => {
  const cart = initCart(req);
  cart.items = cart.items.filter(i => String(i.movie) !== String(req.params.id));
  recalc(cart);
  res.redirect('/cart');
};

exports.checkout = async (req, res) => {
  const cart = initCart(req);

  if (!cart.items.length) {
    req.flash('error', 'Your cart is empty');
    return res.redirect('/cart');
  }

  
  const ids = cart.items.map(i => i.movie);
  const fresh = await Movie.find({ _id: { $in: ids } }).lean();
  const byId = new Map(fresh.map(m => [String(m._id), m]));

  let subtotal = 0;
  const orderItems = [];

  for (const i of cart.items) {
    const m = byId.get(String(i.movie));
    if (!m || !m.published) {
      req.flash('error', 'Some items are no longer available');
      return res.redirect('/cart');
    }
    const price = Number(m.price);
    const qty = parseQty(i.qty);
    subtotal += price * qty;

    orderItems.push({
      movie: m._id,
      title: m.title,
      price,
      qty
    });
  }

  const total = Number(subtotal.toFixed(2));

  await Order.create({
    user: req.session.user.id, 
    userId: req.session.user.id, 
    items: orderItems,
    total
  });

  req.session.cart = { items: [], total: 0 };
  req.flash('success', 'Purchase confirmed!');
  res.redirect('/');
};
