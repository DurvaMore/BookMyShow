import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ShowtimeWithTheater {
  id: string;
  show_time: string;
  show_date: string;
  available_seats: number;
  price: number;
  theater: {
    id: string;
    name: string;
    location: string | null;
  };
}

export const useShowtimes = (movieId: string | undefined) => {
  return useQuery({
    queryKey: ["showtimes", movieId],
    enabled: !!movieId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("showtimes")
        .select("id, show_time, show_date, available_seats, price, theaters(id, name, location)")
        .eq("movie_id", movieId!)
        .order("show_time", { ascending: true });
      if (error) throw error;

      // Group by theater
      return (data as unknown as Array<{
        id: string;
        show_time: string;
        show_date: string;
        available_seats: number;
        price: number;
        theaters: { id: string; name: string; location: string | null };
      }>).map((row) => ({
        id: row.id,
        show_time: row.show_time,
        show_date: row.show_date,
        available_seats: row.available_seats,
        price: row.price,
        theater: row.theaters,
      }));
    },
  });
};

/** Group flat showtimes list by theater */
export function groupByTheater(showtimes: ShowtimeWithTheater[]) {
  const map = new Map<string, { theater: ShowtimeWithTheater["theater"]; shows: ShowtimeWithTheater[] }>();
  for (const st of showtimes) {
    const existing = map.get(st.theater.id);
    if (existing) {
      existing.shows.push(st);
    } else {
      map.set(st.theater.id, { theater: st.theater, shows: [st] });
    }
  }
  return Array.from(map.values());
}
