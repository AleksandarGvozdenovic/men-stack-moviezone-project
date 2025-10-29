const User = require('../models/User'); 

exports.getLogin = (req, res) => res.render('auth/login', { title: 'Login' });

exports.postLogin = async (req, res) => {
  const email = (req.body.email || '').toLowerCase().trim();
  const password = req.body.password || '';

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/auth/login');
  }

  const displayName =
    (user.name && user.name.trim()) ||
    (user.email && user.email.split('@')[0]) ||
    'User';

  req.session.user = { id: user._id, name: displayName, email: user.email, role: user.role };
  req.flash('success', `Welcome, ${displayName}!`);
  res.redirect('/');
};

exports.getRegister = (req, res) => res.render('auth/register', { title: 'Register' });

exports.postRegister = async (req, res) => {
  const nameRaw = (req.body.name || '').trim();
  const email = (req.body.email || '').toLowerCase().trim();
  const password = req.body.password || '';

  const fallbackName = email.includes('@') ? email.split('@')[0] : 'User';
  const name = nameRaw || fallbackName;

  try {
    await User.create({ name, email, password });
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/auth/login');
  } catch (e) {
    req.flash('error', e.code === 11000 ? 'Email already in use.' : 'Registration failed.');
    res.redirect('/auth/register');
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
