import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DbMovie } from "@/hooks/useMovies";

interface HeroCarouselProps {
  movies: DbMovie[];
  onBookNow?: (movie: DbMovie) => void;
}

const HeroCarousel = ({ movies, onBookNow }: HeroCarouselProps) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % movies.length);
  }, [movies.length]);

  const prev = () => {
    setCurrent((c) => (c - 1 + movies.length) % movies.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (movies.length === 0) return null;

  const movie = movies[current];

  return (
    <section className="relative w-full overflow-hidden bg-card">
      <div className="relative h-[320px] sm:h-[420px] lg:h-[500px]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${movie.poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Content */}
        <div className="container relative mx-auto flex h-full items-end px-4 pb-10 sm:items-center sm:pb-0">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{movie.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {movie.genre.join(" • ")}
            </p>
            <p className="mt-2 text-sm text-foreground/80 sm:text-base">{movie.description}</p>
            <Button
              className="mt-4 font-semibold px-6"
              onClick={() => onBookNow?.(movie)}
            >
              Book Now
            </Button>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 text-foreground hover:bg-background/80 transition hidden sm:block"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 text-foreground hover:bg-background/80 transition hidden sm:block"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
