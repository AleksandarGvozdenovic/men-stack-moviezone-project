require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const morgan = require('morgan');
const flash = require('express-flash');
const engine = require('ejs-mate');         

const app = express();

//====================================Config =====================================//
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moviezone';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret';
const PORT = process.env.PORT || 3000;

// ===================================== DB =====================================//
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ============================== View engine ===============================//
app.engine('ejs', engine);                   
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =============================== Static=====================================//
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =============================== Parsers ====================================/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// ==================================Sessions & flash =============================//
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

// ===================================== Locals for views =============================//
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//============================================Routes==================================//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/movies', require('./routes/movies'));
app.use('/cart', require('./routes/cart'));

//=============================================404=====================================//
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
