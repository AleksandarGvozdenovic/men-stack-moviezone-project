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

exports.home = async (req, res, next) => {
  try {
    const { q = '', genre = '', min = '', max = '', page = '1', sort = 'new' } = req.query;
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

    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }

    const sortMap = { new: { createdAt: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, title: { title: 1 } };
    const sortBy = sortMap[sort] || sortMap.new;

    const perPage = 12;
    const current = Math.max(parseInt(page, 10) || 1, 1);

    const [movies, total] = await Promise.all([
      Movie.find(filter).sort(sortBy).skip((current - 1) * perPage).limit(perPage).lean(),
      Movie.countDocuments(filter)
    ]);

  
    const qShown = q.trim().length === 1 ? '' : q;
    const genreShown = genre.trim().length === 1 ? '' : genre;

    res.render('index', {
      title: 'Movie Zone',
      movies,
      q: qShown, genre: genreShown, min, max,
      page: current, pages: Math.ceil(total / perPage), sort
    });
  } catch (e) {
    next(e);
  }
};
