import type { Movie } from '@/types';

// Base movie templates for generating 1500 movies
const englishTitles = [
  'The Last', 'Eternal', 'Hidden', 'Lost', 'Secret', 'Dark', 'Light', 'Rising', 'Falling', 'Broken',
  'Perfect', 'Impossible', 'Infinite', 'Unknown', 'Silent', 'Deadly', 'Dangerous', 'Beautiful', 'Ugly', 'Wild',
  'Quiet', 'Loud', 'Fast', 'Slow', 'High', 'Low', 'Deep', 'Shallow', 'Strong', 'Weak',
  'Brave', 'Coward', 'Hero', 'Villain', 'King', 'Queen', 'Prince', 'Princess', 'Knight', 'Warrior',
  'Dream', 'Nightmare', 'Memory', 'Forgotten', 'Remembered', 'Found', 'Created', 'Destroyed', 'Saved', 'Lost',
  'Journey', 'Adventure', 'Quest', 'Mission', 'Escape', 'Return', 'Beginning', 'End', 'Middle', 'Edge',
  'Shadow', 'Ghost', 'Spirit', 'Soul', 'Heart', 'Mind', 'Body', 'Flesh', 'Blood', 'Bone',
  'Fire', 'Water', 'Earth', 'Air', 'Wind', 'Storm', 'Rain', 'Snow', 'Ice', 'Flame',
  'Golden', 'Silver', 'Bronze', 'Iron', 'Steel', 'Crystal', 'Diamond', 'Ruby', 'Emerald', 'Sapphire',
  'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Black', 'White', 'Gray', 'Brown'
];

const hindiTitles = [
  'Dil', 'Dosti', 'Pyaar', 'Mohabbat', 'Ishq', 'Jung', 'Jeet', 'Haar', 'Zindagi', 'Maut',
  'Raaz', 'Chakravyuh', 'Dharma', 'Karma', 'Bhagya', 'Kismat', 'Sangram', 'Vijay', 'Raj', 'Mahal',
  'Ghar', 'Parivaar', 'Rishta', 'Bandhan', 'Azadi', 'Kranti', 'Inquilab', 'Insaaf', 'Kanoon', 'Adaalat',
  'Sauda', 'Karz', 'Daan', 'Dacoit', 'Sholay', 'Aag', 'Paani', 'Aakash', 'Prithvi', 'Agnipath',
  'Shaheed', 'Veer', 'Mahan', 'Mahaan', 'Swarg', 'Narak', 'Devta', 'Danav', 'Insaan', 'Janwar',
  'Ladai', 'Jhagda', 'Milap', 'Bichhad', 'Milan', 'Judai', 'Suhaag', 'Mangal', 'Shubh', 'Ashubh',
  'Chand', 'Sooraj', 'Taara', 'Aasmaan', 'Dharti', 'Samundar', 'Pahaad', 'Nadi', 'Jheel', 'Baghicha',
  'Raja', 'Rani', 'Badshah', 'Begum', 'Nawab', 'Wazir', 'Senapati', 'Sipahi', 'Daku', 'Police',
  'Beta', 'Beti', 'Maa', 'Baap', 'Bhai', 'Behan', 'Dada', 'Dadi', 'Nana', 'Nani',
  'Shaadi', 'Barat', 'Doli', 'Arthi', 'Mandir', 'Masjid', 'Gurdwara', 'Church', 'School', 'College'
];

const genres = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Cartoon',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

const hindiGenres = [
  'Action', 'Comedy', 'Crime', 'Drama', 'Family', 'Musical', 'Romance', 'Thriller', 'Cartoon'
];

const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa', 'James', 'Emily',
  'William', 'Olivia', 'Richard', 'Sophia', 'Thomas', 'Ava', 'Charles', 'Mia', 'Daniel', 'Isabella',
  'Amitabh', 'Shahrukh', 'Salman', 'Aamir', 'Akshay', 'Hrithik', 'Ranbir', 'Ranveer', 'Varun', 'Tiger',
  'Deepika', 'Priyanka', 'Katrina', 'Kareena', 'Alia', 'Anushka', 'Shraddha', 'Jacqueline', 'Kiara', 'Sara'
];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Khan', 'Kapoor', 'Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Khanna', 'Chopra',
  'Bachchan', 'Roshan', 'Dhawan', 'Bhatt', 'Johar', 'Anand', 'Bakshi', 'Mehra', 'Sippy', 'Chopra'
];

const posterImages = [
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1594909122849-11daa2a0cf2b?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1596727147705-54a9d099308d?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1560932687-45ce2eb0a400?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1581822261290-991b73283543?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1594909122849-11daa2a0cf2b?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomRating(): number {
  // Generate ratings between 1.0 and 9.5, weighted toward higher ratings
  const base = Math.random();
  if (base < 0.05) return 1.0 + Math.random() * 2;
  if (base < 0.15) return 3.0 + Math.random() * 2;
  if (base < 0.35) return 5.0 + Math.random() * 1.5;
  if (base < 0.65) return 6.5 + Math.random() * 1.5;
  if (base < 0.90) return 8.0 + Math.random() * 1.0;
  return 9.0 + Math.random() * 0.5;
}

function generateDescription(_title: string, genre: string[], year: number): string {
  const templates = [
    `A captivating ${genre[0].toLowerCase()} film from ${year} that explores themes of courage and redemption.`,
    `An unforgettable journey through the world of ${genre[0].toLowerCase()}, featuring stunning performances.`,
    `This ${year} release redefined the ${genre[0].toLowerCase()} genre with its innovative storytelling.`,
    `A masterful blend of ${genre.join(' and ').toLowerCase()} that keeps audiences engaged throughout.`,
    `One of the most talked-about films of ${year}, pushing boundaries in ${genre[0].toLowerCase()} cinema.`,
    `A timeless classic that continues to inspire generations of filmmakers and movie lovers alike.`,
    `An emotional rollercoaster that takes viewers on an unforgettable cinematic experience.`,
    `A groundbreaking achievement in ${genre[0].toLowerCase()} filmmaking that set new standards.`,
    `This critically acclaimed film showcases the best of ${genre.join(' and ').toLowerCase()} storytelling.`,
    `A must-watch for fans of ${genre[0].toLowerCase()} cinema, delivering powerful performances.`
  ];
  return getRandomElement(templates);
}

export function generateMovies(count: number = 1500): Movie[] {
  const movies: Movie[] = [];
  const usedTitles = new Set<string>();

  // Generate English movies (60%)
  const englishCount = Math.floor(count * 0.6);
  for (let i = 0; i < englishCount; i++) {
    let title: string;
    let attempts = 0;
    do {
      const prefix = getRandomElement(englishTitles);
      const suffix = getRandomElement(englishTitles);
      title = `${prefix} ${suffix}`;
      attempts++;
    } while (usedTitles.has(title) && attempts < 100);
    
    usedTitles.add(title);
    const genreCount = Math.floor(Math.random() * 2) + 1;
    const movieGenres = getRandomElements(genres, genreCount);
    const year = 1950 + Math.floor(Math.random() * 74);
    const rating = generateRandomRating();
    
    movies.push({
      id: `en-${i + 1}`,
      title,
      year,
      genre: movieGenres,
      rating: Math.round(rating * 4) / 4, // Round to 0.25
      director: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
      actors: [
        `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
        `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`
      ],
      description: generateDescription(title, movieGenres, year),
      poster: posterImages[i % posterImages.length],
      duration: 85 + Math.floor(Math.random() * 100),
      language: 'English',
      popularity: Math.floor(Math.random() * 100)
    });
  }

  // Generate Hindi movies (40%)
  const hindiCount = count - englishCount;
  for (let i = 0; i < hindiCount; i++) {
    let title: string;
    let attempts = 0;
    do {
      const prefix = getRandomElement(hindiTitles);
      const suffix = getRandomElement(hindiTitles);
      title = `${prefix} ${suffix}`;
      attempts++;
    } while (usedTitles.has(title) && attempts < 100);
    
    usedTitles.add(title);
    const genreCount = Math.floor(Math.random() * 2) + 1;
    const movieGenres = getRandomElements(hindiGenres, genreCount);
    const year = 1960 + Math.floor(Math.random() * 64);
    const rating = generateRandomRating();
    
    movies.push({
      id: `hi-${i + 1}`,
      title,
      year,
      genre: movieGenres,
      rating: Math.round(rating * 4) / 4, // Round to 0.25
      director: `${getRandomElement(firstNames.slice(20, 40))} ${getRandomElement(lastNames.slice(20, 40))}`,
      actors: [
        `${getRandomElement(firstNames.slice(20, 40))} ${getRandomElement(lastNames.slice(20, 40))}`,
        `${getRandomElement(firstNames.slice(20, 40))} ${getRandomElement(lastNames.slice(20, 40))}`
      ],
      description: generateDescription(title, movieGenres, year),
      poster: posterImages[(i + englishCount) % posterImages.length],
      duration: 120 + Math.floor(Math.random() * 80),
      language: 'Hindi',
      popularity: Math.floor(Math.random() * 100)
    });
  }

  return movies.sort(() => Math.random() - 0.5);
}

export const allGenres = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Cartoon',
  'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'Musical', 
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
];

export const allLanguages = ['English', 'Hindi'];
