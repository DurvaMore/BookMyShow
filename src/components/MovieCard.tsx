import { Star } from "lucide-react";
import type { Movie } from "@/data/movies";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-lg bg-card border border-border transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {movie.rating}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold">{movie.title}</h3>
        <p className="mt-1 flex flex-wrap gap-1">
          {movie.genre.map((g) => (
            <span key={g} className="text-[11px] text-muted-foreground">
              {g}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
