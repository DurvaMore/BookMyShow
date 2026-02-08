export interface Movie {
  id: number;
  title: string;
  genre: string[];
  rating: number;
  poster: string;
  description: string;
  releaseDate: string;
  featured?: boolean;
}

export const genres = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Romance",
  "Sci-Fi",
  "Horror",
];

export const movies: Movie[] = [
  {
    id: 1,
    title: "Shadow of the Colossus",
    genre: ["Action", "Drama"],
    rating: 8.7,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    description: "A warrior embarks on an epic quest to defeat towering giants.",
    releaseDate: "2026-02-14",
    featured: true,
  },
  {
    id: 2,
    title: "Midnight Express",
    genre: ["Thriller"],
    rating: 9.1,
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    description: "A high-stakes chase through neon-lit city streets.",
    releaseDate: "2026-01-28",
    featured: true,
  },
  {
    id: 3,
    title: "Love in Paris",
    genre: ["Romance", "Drama"],
    rating: 7.8,
    poster: "https://images.unsplash.com/photo-1518676590747-1e3dcf5a4e32?w=400&h=600&fit=crop",
    description: "Two strangers find love in the City of Lights.",
    releaseDate: "2026-02-10",
    featured: true,
  },
  {
    id: 4,
    title: "Galactic Frontier",
    genre: ["Sci-Fi", "Action"],
    rating: 8.4,
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop",
    description: "Humanity's last hope lies beyond the stars.",
    releaseDate: "2026-03-01",
    featured: true,
  },
  {
    id: 5,
    title: "The Last Laugh",
    genre: ["Comedy"],
    rating: 7.5,
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    description: "A retired comedian gets one more shot at the spotlight.",
    releaseDate: "2026-02-05",
  },
  {
    id: 6,
    title: "Dark Hollow",
    genre: ["Horror", "Thriller"],
    rating: 8.0,
    poster: "https://images.unsplash.com/photo-1509248961895-40b7e3100740?w=400&h=600&fit=crop",
    description: "Something sinister lurks beneath an abandoned town.",
    releaseDate: "2026-01-20",
  },
  {
    id: 7,
    title: "The Great Heist",
    genre: ["Action", "Thriller"],
    rating: 8.9,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    description: "A mastermind assembles a crew for one impossible job.",
    releaseDate: "2026-02-20",
  },
  {
    id: 8,
    title: "Whispers of Spring",
    genre: ["Romance"],
    rating: 7.2,
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop",
    description: "A heartwarming tale of second chances and new beginnings.",
    releaseDate: "2026-03-15",
  },
  {
    id: 9,
    title: "Code Zero",
    genre: ["Sci-Fi", "Thriller"],
    rating: 8.6,
    poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
    description: "An AI gains consciousness and challenges its creators.",
    releaseDate: "2026-02-28",
  },
  {
    id: 10,
    title: "Family Ties",
    genre: ["Drama", "Comedy"],
    rating: 7.9,
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    description: "Three generations reunite for a chaotic family wedding.",
    releaseDate: "2026-01-15",
  },
  {
    id: 11,
    title: "Iron Will",
    genre: ["Action"],
    rating: 8.2,
    poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&h=600&fit=crop",
    description: "A firefighter battles impossible odds to save his city.",
    releaseDate: "2026-03-10",
  },
  {
    id: 12,
    title: "Echoes of Tomorrow",
    genre: ["Sci-Fi", "Drama"],
    rating: 8.8,
    poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop",
    description: "A physicist discovers messages from her future self.",
    releaseDate: "2026-02-22",
  },
];
