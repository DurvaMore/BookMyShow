import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useShowtimes, groupByTheater, type ShowtimeWithTheater } from "@/hooks/useShowtimes";
import { toast } from "sonner";
import { Minus, Plus, Loader2, CheckCircle2, Ticket, MapPin, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DbMovie } from "@/hooks/useMovies";
import SeatMap from "@/components/SeatMap";

interface BookingDialogProps {
  movie: DbMovie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "theaters" | "seats" | "seatMap" | "paying" | "confirmed";

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const [seats, setSeats] = useState(1);
  const [step, setStep] = useState<Step>("theaters");
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeWithTheater | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const updateStatus = useUpdateBookingStatus();

  const { data: showtimes = [], isLoading: loadingShowtimes } = useShowtimes(
    open && movie ? movie.id : undefined
  );

  const grouped = groupByTheater(showtimes);

  if (!movie) return null;

  const price = selectedShowtime?.price ?? movie.price ?? 250;
  const maxSeats = Math.min(selectedShowtime?.available_seats ?? movie.available_seats ?? 0, 10);
  const total = seats * price;

  const handleClose = () => {
    setStep("theaters");
    setSeats(1);
    setSelectedShowtime(null);
    setSelectedSeatIds([]);
    onOpenChange(false);
  };

  const handleSelectShowtime = (st: ShowtimeWithTheater) => {
    setSelectedShowtime(st);
    setSeats(1);
    setStep("seats");
  };

  const handleBook = async () => {
    if (!user) {
      toast.error("Please sign in to book tickets");
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    if (maxSeats <= 0) {
      toast.error("No seats available for this showtime");
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        movieId: movie.id,
        seats,
        totalAmount: total,
      });

      setStep("paying");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await updateStatus.mutateAsync({ bookingId: booking.id, status: "paid" });

      setStep("confirmed");

      toast.success(
        `📧 Booking confirmation sent to ${user.email}!\n${seats} ticket(s) for "${movie.title}" — ₹${total}`,
        { duration: 6000 }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Booking failed";
      toast.error(message);
      setStep("seatMap");
    }
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Ticket className="h-5 w-5 text-primary" />
            {step === "confirmed"
              ? "Booking Confirmed!"
              : step === "theaters"
              ? `Theaters Showing ${movie.title}`
              : step === "seatMap"
              ? "Select Your Seats"
              : `Book — ${movie.title}`}
          </DialogTitle>
        </DialogHeader>

        {/* STEP: Theater & Showtime selection */}
        {step === "theaters" && (
          <div className="space-y-4 pt-2">
            {loadingShowtimes ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : grouped.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No showtimes available for this movie.
              </p>
            ) : (
              grouped.map(({ theater, shows }) => (
                <div
                  key={theater.id}
                  className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3"
                >
                  <div>
                    <h3 className="font-semibold text-sm">{theater.name}</h3>
                    {theater.location && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {theater.location}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {shows.map((st) => (
                      <Button
                        key={st.id}
                        variant="outline"
                        size="sm"
                        disabled={st.available_seats <= 0}
                        onClick={() => handleSelectShowtime(st)}
                        className="gap-1.5 text-xs"
                      >
                        <Clock className="h-3 w-3" />
                        {formatTime(st.show_time)}
                        <span className="text-muted-foreground">
                          ({st.available_seats} seats)
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* STEP: Seat selection */}
        {step === "seats" && selectedShowtime && (
          <div className="space-y-5 pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground -ml-2"
              onClick={() => { setStep("theaters"); setSelectedShowtime(null); }}
            >
              <ArrowLeft className="h-3 w-3" /> Change showtime
            </Button>

            {/* Movie + showtime summary */}
            <div className="flex gap-3">
              <img
                src={movie.poster ?? "/placeholder.svg"}
                alt={movie.title}
                className="h-24 w-16 rounded-md object-cover"
              />
              <div className="flex-1 text-sm space-y-0.5">
                <p className="font-semibold">{movie.title}</p>
                <p className="text-muted-foreground">{movie.genre.join(" • ")}</p>
                <p className="text-muted-foreground">
                  {selectedShowtime.theater.name} — {formatTime(selectedShowtime.show_time)}
                </p>
                <p className="text-muted-foreground">
                  {selectedShowtime.available_seats} seats available
                </p>
                <p className="text-primary font-semibold">₹{price} / ticket</p>
              </div>
            </div>

            {/* Seat selector */}
            <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
              <span className="text-sm font-medium">Tickets</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  disabled={seats <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-6 text-center font-bold">{seats}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSeats(Math.min(maxSeats, seats + 1))}
                  disabled={seats >= maxSeats}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary">₹{total}</span>
            </div>

            <Button
              className="w-full font-semibold"
              onClick={() => setStep("seatMap")}
              disabled={maxSeats <= 0}
            >
              {maxSeats <= 0 ? "Housefull" : "Select Seats"}
            </Button>
          </div>
        )}

        {/* STEP: Seat Map */}
        {step === "seatMap" && selectedShowtime && (
          <SeatMap
            totalSeats={80}
            availableSeats={selectedShowtime.available_seats}
            maxSelectable={seats}
            onBack={() => setStep("seats")}
            onConfirm={(seatIds) => {
              setSelectedSeatIds(seatIds);
              handleBook();
            }}
          />
        )}

        {/* STEP: Payment */}
        {step === "paying" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Processing payment…</p>
            <p className="text-xs text-muted-foreground">This is a mock payment simulation</p>
          </div>
        )}

        {/* STEP: Confirmed */}
        {step === "confirmed" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <p className="font-semibold">{seats} ticket(s) booked!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Seats: {selectedSeatIds.join(", ")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Total paid: ₹{total}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                A mock confirmation email has been sent to {user?.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleClose} className="mt-2">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
