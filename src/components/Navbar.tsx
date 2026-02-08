import { useState } from "react";
import { Search, MapPin, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navLinks = ["Movies", "Events", "Shows"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-1 text-xl font-bold tracking-tight">
          <span className="text-primary">Book</span>
          <span className="text-foreground">MyShow</span>
        </a>

        {/* Search - hidden on mobile */}
        <div className="hidden flex-1 items-center gap-2 md:flex max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for movies, events, shows..."
              className="pl-9 bg-secondary border-none h-9 text-sm"
            />
          </div>
        </div>

        {/* City + Nav links - hidden on mobile */}
        <div className="hidden items-center gap-6 md:flex">
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
            Mumbai
          </button>
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          <div className="relative my-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-secondary border-none h-9 text-sm"
            />
          </div>
          <button className="flex w-full items-center gap-1 py-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Mumbai
          </button>
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
