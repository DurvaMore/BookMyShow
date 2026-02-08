import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import GenreFilter from "@/components/GenreFilter";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { movies } from "@/data/movies";

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");

  const featuredMovies = useMemo(() => movies.filter((m) => m.featured), []);

  const filteredMovies = useMemo(
    () =>
      selectedGenre === "All"
        ? movies
        : movies.filter((m) => m.genre.includes(selectedGenre)),
    [selectedGenre]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel movies={featuredMovies} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Now Showing</h2>
        </div>

        <div className="mt-4">
          <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            No movies found for this genre.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
