import { useBookings } from "@/hooks/useBookings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Loader2, Ticket } from "lucide-react";
import { format } from "date-fns";

const statusColor: Record<string, string> = {
  paid: "bg-green-600/20 text-green-400 border-green-600/30",
  pending: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  cancelled: "bg-red-600/20 text-red-400 border-red-600/30",
};

const MyBookings = () => {
  const { data: bookings, isLoading } = useBookings();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          My Bookings
        </h1>

        {isLoading && (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (!bookings || bookings.length === 0) && (
          <p className="mt-12 text-center text-muted-foreground">
            You haven't booked any tickets yet.
          </p>
        )}

        <div className="mt-6 grid gap-4">
          {bookings?.map((booking: any) => (
            <div
              key={booking.id}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <img
                src={booking.movies?.poster ?? "/placeholder.svg"}
                alt={booking.movies?.title}
                className="h-24 w-16 shrink-0 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold truncate">{booking.movies?.title}</h3>
                  <Badge
                    variant="outline"
                    className={statusColor[booking.status ?? "pending"]}
                  >
                    {booking.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {booking.seats} ticket(s) • ₹{booking.total_amount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(booking.booked_at), "dd MMM yyyy, hh:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
