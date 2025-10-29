const fs = require('fs');
const path = require('path');
const Movie = require('../models/Movie'); 

function escapeRegex(str = '') {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function mapGenreAlias(input = '') {
  const s = input.toLowerCase().trim();
  const dict = [
    { keys: ['krimi', 'kriminal', 'crime'], val: 'crime' },
    { keys: ['akcija', 'action'], val: 'action' },
    { keys: ['triler', 'thriller'], val: 'thriller' },
    { keys: ['fantazija', 'fantastika', 'fantasy'], val: 'fantasy' },
    { keys: ['animirani', 'crtani', 'animation', 'animated'], val: 'animation' },
    { keys: ['biografija', 'biography', 'biopic'], val: 'biography' },
    { keys: ['drama'], val: 'drama' },
    { keys: ['komedija', 'comedy'], val: 'comedy' },
    { keys: ['sf', 'sci fi', 'sci-fi', 'science fiction', 'naucna fantastika', 'naučna fantastika'], val: 'sci-fi' },
    { keys: ['misterija', 'mystery'], val: 'mystery' },
    { keys: ['horor', 'horror'], val: 'horror' }
  ];
  for (const row of dict) if (row.keys.some(k => s.includes(k))) return row.val;
  return '';
}

//============= Public list (/movies) ================//
exports.list = async (req, res, next) => {
  try {
    const { q = '', genre = '' } = req.query;
    const filter = { published: true };

    if (q.trim()) {
      const safe = escapeRegex(q.trim());
      filter.$or = [
        { title: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } }
      ];
    }

    if (genre.trim()) {
      const raw = escapeRegex(genre.trim());
      const alias = mapGenreAlias(genre);
      const parts = [{ genre: { $regex: raw, $options: 'i' } }];
      if (alias) parts.push({ genre: { $regex: escapeRegex(alias), $options: 'i' } });
      filter.$or = filter.$or ? [...filter.$or, ...parts] : parts;
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 }).lean();

    res.render('movies/list', {
      title: 'Movies',
      movies,
      q: q.trim().length === 1 ? '' : q,
      genre: genre.trim().length === 1 ? '' : genre
    });
  } catch (e) {
    next(e);
  }
};

//====================Public details===================//
exports.details = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie || (!movie.published && (!req.session.user || req.session.user.role !== 'admin'))) {
      req.flash('error', 'Movie not found');
      return res.redirect('/movies');
    }
    res.render('movies/details', { title: movie.title, movie });
  } catch (e) {
    next(e);
  }
};

//======================= Admin form===================//
exports.renderNew = (req, res) => res.render('movies/form', { title: 'New Movie', movie: {} });

//========================Admin create===================//
exports.create = async (req, res, next) => {
  try {
    const { title, description, genre, price, duration, published } = req.body;
    const priceNum = Number(price);
    const durationNum = Number(duration);

    if (!title || !description || !genre || isNaN(priceNum) || isNaN(durationNum)) {
      req.flash('error', 'Please provide valid title/description/genre/price/duration');
      return res.redirect('back');
    }

    await Movie.create({
      title,
      description,
      genre,
      price: priceNum,
      duration: durationNum,
      published: !!published,
      poster: req.file ? req.file.filename : undefined
    });

    req.flash('success', 'Movie created');
    res.redirect('/movies');
  } catch (e) {
    next(e);
  }
};

//======================== Admin edit form=============//
exports.renderEdit = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) {
      req.flash('error', 'Movie not found');
      return res.redirect('/movies');
    }
    res.render('movies/form', { title: 'Edit Movie', movie });
  } catch (e) {
    next(e);
  }
};

//====================Admin update ============//
exports.update = async (req, res, next) => {
  try {
    const { title, description, genre, price, duration, published } = req.body;
    const priceNum = Number(price);
    const durationNum = Number(duration);

    if (!title || !description || !genre || isNaN(priceNum) || isNaN(durationNum)) {
      req.flash('error', 'Please provide valid title/description/genre/price/duration');
      return res.redirect('back');
    }

    const update = { title, description, genre, price: priceNum, duration: durationNum, published: !!published };

    if (req.file) {
      const old = await Movie.findById(req.params.id).lean();
      if (old?.poster) {
        const p = path.join(__dirname, '..', 'uploads', old.poster);
        if (fs.existsSync(p)) fs.unlink(p, () => {});
      }
      update.poster = req.file.filename;
    }

    await Movie.findByIdAndUpdate(req.params.id, update);
    req.flash('success', 'Movie updated');
    res.redirect('/movies');
  } catch (e) {
    next(e);
  }
};

//==================Admin delete =============//
exports.destroy = async (req, res, next) => {
  try {
    const old = await Movie.findByIdAndDelete(req.params.id).lean();
    if (old?.poster) {
      const p = path.join(__dirname, '..', 'uploads', old.poster);
      if (fs.existsSync(p)) fs.unlink(p, () => {});
    }
    req.flash('success', 'Movie deleted');
    res.redirect('/movies');
  } catch (e) {
    next(e);
  }
};
