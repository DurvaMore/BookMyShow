
-- Theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Theaters are publicly viewable"
  ON public.theaters FOR SELECT USING (true);

-- Showtimes table (links movies to theaters with time slots)
CREATE TABLE public.showtimes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  show_time TIME NOT NULL,
  show_date DATE NOT NULL DEFAULT CURRENT_DATE,
  available_seats INTEGER NOT NULL DEFAULT 100,
  price NUMERIC NOT NULL DEFAULT 250.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.showtimes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Showtimes are publicly viewable"
  ON public.showtimes FOR SELECT USING (true);

-- Seed theaters
INSERT INTO public.theaters (id, name, location) VALUES
  ('a1b2c3d4-1111-1111-1111-111111111111', 'PVR Cinemas - Phoenix Mall', 'Lower Parel, Mumbai'),
  ('a1b2c3d4-2222-2222-2222-222222222222', 'INOX - R-City Mall', 'Ghatkopar, Mumbai'),
  ('a1b2c3d4-3333-3333-3333-333333333333', 'Cinépolis - Viviana Mall', 'Thane'),
  ('a1b2c3d4-4444-4444-4444-444444444444', 'PVR IMAX - Juhu', 'Juhu, Mumbai');

-- Seed showtimes for every movie (cross join with theaters, 3 time slots each)
INSERT INTO public.showtimes (movie_id, theater_id, show_time, show_date, available_seats, price)
SELECT
  m.id,
  t.id,
  s.time_slot,
  CURRENT_DATE,
  50 + floor(random() * 50)::int,
  m.price
FROM public.movies m
CROSS JOIN public.theaters t
CROSS JOIN (VALUES ('10:00'::time), ('14:30'::time), ('19:00'::time)) AS s(time_slot);
