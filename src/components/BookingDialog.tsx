import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { toast } from "sonner";
import { Minus, Plus, Loader2, CheckCircle2, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DbMovie } from "@/hooks/useMovies";

interface BookingDialogProps {
  movie: DbMovie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "seats" | "paying" | "confirmed";

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const [seats, setSeats] = useState(1);
  const [step, setStep] = useState<Step>("seats");
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const updateStatus = useUpdateBookingStatus();

  if (!movie) return null;

  const price = movie.price ?? 250;
  const maxSeats = Math.min(movie.available_seats ?? 0, 10);
  const total = seats * price;

  const handleClose = () => {
    setStep("seats");
    setSeats(1);
    onOpenChange(false);
  };

  const handleBook = async () => {
    if (!user) {
      toast.error("Please sign in to book tickets");
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    if (maxSeats <= 0) {
      toast.error("No seats available for this movie");
      return;
    }

    try {
      // Step 1: Create pending booking
      const booking = await createBooking.mutateAsync({
        movieId: movie.id,
        seats,
        totalAmount: total,
      });

      // Step 2: Mock payment processing
      setStep("paying");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 3: Mark as paid
      await updateStatus.mutateAsync({ bookingId: booking.id, status: "paid" });

      setStep("confirmed");

      // Mock email notification
      toast.success(
        `📧 Booking confirmation sent to ${user.email}!\n${seats} ticket(s) for "${movie.title}" — ₹${total}`,
        { duration: 6000 }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Booking failed";
      toast.error(message);
      setStep("seats");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Ticket className="h-5 w-5 text-primary" />
            {step === "confirmed" ? "Booking Confirmed!" : `Book — ${movie.title}`}
          </DialogTitle>
        </DialogHeader>

        {step === "seats" && (
          <div className="space-y-5 pt-2">
            {/* Movie summary */}
            <div className="flex gap-3">
              <img
                src={movie.poster ?? "/placeholder.svg"}
                alt={movie.title}
                className="h-24 w-16 rounded-md object-cover"
              />
              <div className="flex-1 text-sm">
                <p className="font-semibold">{movie.title}</p>
                <p className="text-muted-foreground">{movie.genre.join(" • ")}</p>
                <p className="mt-1 text-muted-foreground">
                  {movie.available_seats} seats available
                </p>
                <p className="text-primary font-semibold mt-1">₹{price} / ticket</p>
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
              onClick={handleBook}
              disabled={createBooking.isPending || maxSeats <= 0}
            >
              {maxSeats <= 0 ? "Housefull" : "Pay & Book"}
            </Button>
          </div>
        )}

        {step === "paying" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Processing payment…</p>
            <p className="text-xs text-muted-foreground">This is a mock payment simulation</p>
          </div>
        )}

        {step === "confirmed" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <p className="font-semibold">{seats} ticket(s) booked!</p>
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
