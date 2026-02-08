import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DbMovie } from "@/hooks/useMovies";

interface MovieCardProps {
  movie: DbMovie;
  onBookNow?: () => void;
}

const MovieCard = ({ movie, onBookNow }: MovieCardProps) => {
  const isAvailable = movie.availability === "now_showing" && (movie.available_seats ?? 0) > 0;

  return (
    <div className="group cursor-pointer overflow-hidden rounded-lg bg-card border border-border transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster ?? "/placeholder.svg"}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {movie.rating}
        </div>

        {/* Availability badge */}
        {movie.availability === "coming_soon" && (
          <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px]">
            Coming Soon
          </Badge>
        )}
        {movie.availability === "housefull" && (
          <Badge variant="destructive" className="absolute top-2 left-2 text-[10px]">
            Housefull
          </Badge>
        )}

        {/* Book overlay on hover */}
        {isAvailable && onBookNow && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              className="m-3 w-[calc(100%-1.5rem)] font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onBookNow();
              }}
            >
              Book Now — ₹{movie.price ?? 250}
            </Button>
          </div>
        )}
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
        {isAvailable && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {movie.available_seats} seats left
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
