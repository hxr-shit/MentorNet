import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-sm bg-card/80">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="font-bold text-xl text-primary shrink-0">MentorNet</Link>

        <div className="hidden md:flex items-center gap-6 mx-auto">
          <button onClick={() => scrollTo("about")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</button>
          <button onClick={() => scrollTo("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
          <button onClick={() => scrollTo("how")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</button>
          <button onClick={() => scrollTo("analytics")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Analytics</button>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Log in</Button>
          <Button size="sm" onClick={() => navigate("/signup")} className="bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
        </div>

        <div className="flex items-center gap-2 md:hidden ml-auto">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          <button onClick={() => scrollTo("about")} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">About</button>
          <button onClick={() => scrollTo("features")} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Features</button>
          <button onClick={() => scrollTo("how")} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">How It Works</button>
          <button onClick={() => scrollTo("analytics")} className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Analytics</button>
          <Button variant="ghost" className="w-full" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Log in</Button>
          <Button className="w-full bg-accent text-accent-foreground" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Sign Up</Button>
        </div>
      )}
    </nav>
  );
}
