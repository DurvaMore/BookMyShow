import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROWS = 8;
const COLS = 10;
const ROW_LABELS = "ABCDEFGH".split("");

interface SeatMapProps {
  totalSeats: number;
  availableSeats: number;
  maxSelectable: number;
  onConfirm: (selectedSeats: string[]) => void;
  onBack: () => void;
}

const SeatMap = ({ totalSeats, availableSeats, maxSelectable, onConfirm, onBack }: SeatMapProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Deterministically generate filled seats based on counts
  const filledSeats = useMemo(() => {
    const filled = new Set<string>();
    const seatCount = Math.min(ROWS * COLS, totalSeats);
    const filledCount = Math.max(0, seatCount - availableSeats);

    // Use a simple deterministic pattern to mark filled seats
    let count = 0;
    for (let r = 0; r < ROWS && count < filledCount; r++) {
      for (let c = 0; c < COLS && count < filledCount; c++) {
        // Scatter pattern: fill from edges and middle
        const idx = (r * 3 + c * 7 + 5) % (ROWS * COLS);
        const row = Math.floor(idx / COLS);
        const col = idx % COLS;
        const seatId = `${ROW_LABELS[row]}${col + 1}`;
        if (!filled.has(seatId)) {
          filled.add(seatId);
          count++;
        }
      }
    }
    // Fill remaining if scatter didn't get enough
    if (count < filledCount) {
      for (let r = 0; r < ROWS && count < filledCount; r++) {
        for (let c = 0; c < COLS && count < filledCount; c++) {
          const seatId = `${ROW_LABELS[r]}${c + 1}`;
          if (!filled.has(seatId)) {
            filled.add(seatId);
            count++;
          }
        }
      }
    }
    return filled;
  }, [totalSeats, availableSeats]);

  const toggleSeat = (seatId: string) => {
    if (filledSeats.has(seatId)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else if (next.size < maxSelectable) {
        next.add(seatId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Screen indicator */}
      <div className="mx-auto w-3/4 rounded-t-xl border-2 border-primary/40 bg-primary/10 py-1 text-center text-xs font-semibold text-primary tracking-widest">
        SCREEN
      </div>

      {/* Seat grid */}
      <div className="overflow-x-auto">
        <div className="mx-auto w-fit space-y-1.5 px-2">
          {ROW_LABELS.map((row, ri) => (
            <div key={row} className="flex items-center gap-1.5">
              <span className="w-4 text-[10px] text-muted-foreground font-medium">{row}</span>
              {Array.from({ length: COLS }, (_, ci) => {
                const seatId = `${row}${ci + 1}`;
                const isFilled = filledSeats.has(seatId);
                const isSelected = selected.has(seatId);

                return (
                  <button
                    key={seatId}
                    disabled={isFilled}
                    onClick={() => toggleSeat(seatId)}
                    className={cn(
                      "h-7 w-7 rounded text-[10px] font-semibold transition-all flex items-center justify-center",
                      isFilled
                        ? "bg-muted text-muted-foreground/40 cursor-not-allowed"
                        : isSelected
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                        : "border-2 border-green-500 text-green-500 hover:bg-green-500/10 cursor-pointer"
                    )}
                    title={isFilled ? "Unavailable" : seatId}
                  >
                    {ci + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded border-2 border-green-500" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded bg-primary" />
          Selected
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded bg-muted" />
          Filled
        </div>
      </div>

      {/* Selection info */}
      <p className="text-center text-sm text-muted-foreground">
        {selected.size} / {maxSelectable} seats selected
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1 font-semibold"
          disabled={selected.size !== maxSelectable}
          onClick={() => onConfirm(Array.from(selected).sort())}
        >
          Confirm Seats
        </Button>
      </div>
    </div>
  );
};

export default SeatMap;
