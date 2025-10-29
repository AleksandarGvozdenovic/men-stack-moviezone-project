// scripts/seedTop15.js
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const MONGO_URI = process.env.MONGO_URI;

// 🔝 Top 15 movies of all time (posters must exist in /uploads with the given filenames)
const data = [
  {
    title: "The Shawshank Redemption",
    description:
      "A banker wrongly imprisoned for murder forms a decades-long bond with a fellow inmate as he searches for hope behind bars. Quiet acts of defiance and kindness ripple through a brutal system. A stirring meditation on friendship, perseverance, and the human spirit.",
    genre: "Drama",
    price: 9.0,
    duration: 142,
    published: true,
    poster: "shawshank.jpg"
  },
  {
    title: "The Godfather",
    description:
      "The aging patriarch of a powerful crime family hands the reins to his reluctant son. Loyalty, power, and family collide as the Corleones navigate betrayal and war. A landmark in cinema that shaped the modern gangster saga.",
    genre: "Crime",
    price: 10.0,
    duration: 175,
    published: true,
    poster: "godfather.jpg"
  },
  {
    title: "The Godfather Part II",
    description:
      "A masterful parallel narrative follows young Vito Corleone’s rise while Michael consolidates power with chilling resolve. The sins of the father echo through the son in a tale of legacy and corruption. Widely hailed as one of the greatest sequels ever made.",
    genre: "Crime",
    price: 10.0,
    duration: 202,
    published: true,
    poster: "godfather2.jpg"
  },
  {
    title: "The Dark Knight",
    description:
      "Batman faces the Joker, an anarchic force who pushes Gotham—and its hero—to the edge of chaos. Moral lines blur as sacrifice becomes the only path to survival. A relentless, grounded superhero thriller with operatic stakes.",
    genre: "Action",
    price: 9.5,
    duration: 152,
    published: true,
    poster: "darkknight.jpg"
  },
  {
    title: "Pulp Fiction",
    description:
      "Intersecting stories of hitmen, a boxer, and a crime boss’s wife collide in a darkly comic, time-bending mosaic. Pop-culture riffs meet sudden violence and redemption. Tarantino’s signature dialogue and structure redefined indie cinema.",
    genre: "Crime",
    price: 8.5,
    duration: 154,
    published: true,
    poster: "pulpfiction.jpg"
  },
  {
    title: "The Return of the King",
    description:
      "As Frodo nears Mount Doom, Middle-earth rallies for a final stand against darkness. Friendship, courage, and sacrifice culminate in an epic finale. A sweeping fantasy conclusion that delivers on heart and spectacle.",
    genre: "Fantasy",
    price: 9.5,
    duration: 201,
    published: true,
    poster: "lotr-rotk.jpg"
  },
  {
    title: "Schindler's List",
    description:
      "A German industrialist saves over a thousand Jews during the Holocaust, discovering his conscience amid atrocity. Shot in stark black and white, the film is unflinching and humane. A devastating, essential portrait of moral courage.",
    genre: "Biography",
    price: 9.0,
    duration: 195,
    published: true,
    poster: "schindler.jpg"
  },
  {
    title: "12 Angry Men",
    description:
      "In a sweltering jury room, one holdout challenges the group’s rush to judgment. Prejudice and reason clash as doubt slowly spreads. A taut, single-location drama about justice and the power of persuasion.",
    genre: "Drama",
    price: 8.0,
    duration: 96,
    published: true,
    poster: "12angrymen.jpg"
  },
  {
    title: "Seven Samurai",
    description:
      "Villagers hire samurai to defend their homes from marauding bandits. Honor, strategy, and sacrifice unfold across a sprawling battle for survival. Kurosawa’s epic laid the blueprint for ensemble action storytelling.",
    genre: "Action",
    price: 8.5,
    duration: 207,
    published: true,
    poster: "sevensamurai.jpg"
  },
  {
    title: "Goodfellas",
    description:
      "Through the eyes of Henry Hill, the mob’s seductive highs give way to paranoia and collapse. Scorsese’s kinetic style captures the rush and rot of gangster life. Darkly funny, brutally honest, endlessly quotable.",
    genre: "Crime",
    price: 9.0,
    duration: 146,
    published: true,
    poster: "goodfellas.jpg"
  },
  {
    title: "Fight Club",
    description:
      "An insomniac office worker and a charismatic soap maker form an underground fight club. The movement spirals into something far more radical. A razor-sharp satire of consumerism, identity, and rage.",
    genre: "Drama",
    price: 8.5,
    duration: 139,
    published: true,
    poster: "fightclub.jpg"
  },
  {
    title: "The Matrix",
    description:
      "A hacker learns reality is a simulation and that he might be humanity’s last hope. Bullet time, philosophy, and cyberpunk style fuse into a genre landmark. A mind-bending action sci-fi that changed the game.",
    genre: "Sci-Fi",
    price: 9.0,
    duration: 136,
    published: true,
    poster: "matrix.jpg"
  },
  {
    title: "Inception",
    description:
      "A team of thieves enters dreams to plant an idea deep inside a target’s mind. Layered realities blur as stakes rise across collapsing dreamscapes. A cerebral heist thriller powered by emotion and imagination.",
    genre: "Sci-Fi",
    price: 9.0,
    duration: 148,
    published: true,
    poster: "inception.jpg"
  },
  {
    title: "Parasite",
    description:
      "A poor family infiltrates a wealthy household, setting off a sly, escalating class war. Genre lines vanish in a masterful blend of suspense, humor, and tragedy. A razor-edged social satire with a shocking bite.",
    genre: "Thriller",
    price: 8.5,
    duration: 132,
    published: true,
    poster: "parasite.jpg"
  },
  {
    title: "City of God",
    description:
      "In Rio’s favelas, childhood friends take divergent paths—one toward photography, the other toward crime. Vivid, propulsive storytelling captures beauty and brutality side by side. A searing portrait of fate, violence, and choice.",
    genre: "Crime",
    price: 8.5,
    duration: 130,
    published: true,
    poster: "cityofgod.jpg"
  }
];

(async () => {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI is not defined in .env');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to Mongo');

    // Clear to avoid duplicates during development
    await Movie.deleteMany({});
    console.log('🧹 Cleared movies collection');

    await Movie.insertMany(data);
    console.log(`🎉 Seeded ${data.length} all-time movies with detailed descriptions`);
  } catch (e) {
    console.error('❌ Seed failed:', e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
