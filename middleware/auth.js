function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  req.flash('error', 'Please log in first.');
  return res.redirect('/auth/login');
}

function ensureAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Admins only.');
  return res.redirect('/');
}

module.exports = { ensureAuth, ensureAdmin };
