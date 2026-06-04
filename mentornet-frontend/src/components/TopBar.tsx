import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Search, Plus, Menu, X, LayoutDashboard, Users, MessageSquare, Calendar, Star, Settings, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

export function TopBar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b bg-card/80 backdrop-blur-sm flex items-center gap-4 px-4 md:px-6">
        {/* Mobile menu toggle */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile logo */}
        <Link to="/feed" className="md:hidden font-bold text-lg text-primary">MentorNet</Link>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search discussions..." className="pl-9 bg-secondary border-0 h-9 text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          {currentUser?.role === "student" && (
            <Button size="sm" onClick={() => navigate("/ask")} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-1" /> Ask Question
            </Button>
          )}
          <Link to={`/u/${currentUser?.username}`} className="hidden md:block">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{currentUser?.avatar}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-card border-r p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
            <p className="font-bold text-lg text-primary mb-4">MentorNet</p>
            {[
              { label: "Dashboard", to: "/feed", icon: LayoutDashboard },
              { label: "Communities", to: "/communities", icon: Users },
              { label: "Sessions", to: "/sessions", icon: Calendar },
              { label: "Feedback", to: "/feedback", icon: Star },
              { label: "Settings", to: "/settings", icon: Settings },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            ))}
            {currentUser?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobileOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted">
                  <Shield className="h-4 w-4" /> Admin
                </div>
              </Link>
            )}
            <div className="pt-4 border-t mt-4">
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
