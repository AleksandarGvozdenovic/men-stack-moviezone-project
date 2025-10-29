// routes/movies.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { ensureAdmin } = require('../middleware/auth'); // prilagodi putanju ako je drugačija
const movies = require('../controllers/moviesController');

// Multer (uploads/)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG/PNG/WEBP images allowed'), ok);
  }
});

// Public
router.get('/', movies.list);
router.get('/:id', movies.details);

// Admin
router.get('/admin/new', ensureAdmin, movies.renderNew);
router.post('/admin', ensureAdmin, upload.single('poster'), movies.create);
router.get('/admin/:id/edit', ensureAdmin, movies.renderEdit);
router.post('/admin/:id', ensureAdmin, upload.single('poster'), movies.update);
router.post('/admin/:id/delete', ensureAdmin, movies.destroy);

module.exports = router;
