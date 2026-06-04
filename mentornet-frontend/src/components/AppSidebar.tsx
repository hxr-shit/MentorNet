import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { LayoutDashboard, Users, MessageSquare, Calendar, Star, Settings, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/feed", icon: LayoutDashboard },
  { label: "Communities", to: "/communities", icon: Users },
  { label: "Discussions", to: "/", icon: MessageSquare, match: "/feed" },
  { label: "Sessions", to: "/sessions", icon: Calendar },
  { label: "Feedback", to: "/feedback", icon: Star },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { currentUser, logout } = useApp();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b">
        <Link to="/feed" className="font-bold text-xl text-primary">MentorNet</Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.to || (item.match && location.pathname === item.match);
          return (
            <Link key={item.to + item.label} to={item.to}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
        {currentUser?.role === "admin" && (
          <Link to="/admin">
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === "/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </div>
          </Link>
        )}
      </nav>

      {/* Bottom user section */}
      <div className="mt-auto">
        <Separator />
        <div className="p-4 space-y-3">
          <Link to={`/u/${currentUser?.username}`} className="flex items-center gap-3 hover:bg-muted rounded-lg p-2 -mx-2 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">{currentUser?.avatar}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{currentUser?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
            </div>
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Log out
          </Button>
        </div>
      </div>
    </aside>
  );
}
