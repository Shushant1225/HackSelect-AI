import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, FileText, Users, Trophy, BarChart3, Shield,
  LogOut, Menu, X, ChevronRight, Sparkles, Bell,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ✅ Fixed: keys changed to uppercase to match role values from AuthContext
const navItems: Record<string, { label: string; icon: any; path: string; description: string }[]> = {
  ADMIN: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin", description: "Overview & key metrics" },
    { label: "Analytics", icon: BarChart3, path: "/admin/analytics", description: "Performance analysis" },
    { label: "Hackathons", icon: Trophy, path: "/admin/hackathons", description: "Manage all hackathons" },
    { label: "Users", icon: Users, path: "/admin/users", description: "User management" },
    { label: "Proctor Logs", icon: Shield, path: "/admin/proctor-logs", description: "Exam integrity monitoring" },
  ],
  ORGANIZER: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/organizer", description: "Your overview" },
    { label: "Create Exam", icon: FileText, path: "/organizer/create-exam", description: "Add new exam" },
    { label: "Results", icon: BarChart3, path: "/organizer/results", description: "View & export results" },
    { label: "Shortlisted", icon: Trophy, path: "/organizer/shortlisted", description: "Top candidates" },
    { label: "Proctor Alerts", icon: Shield, path: "/organizer/proctor-alerts", description: "Exam violations" },
  ],
  // ✅ Fixed: was "candidate", role value is "STUDENT"
  STUDENT: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/candidate", description: "Your progress" },
    { label: "Hackathons", icon: Trophy, path: "/candidate/hackathons", description: "Available exams" },
    { label: "My Results", icon: BarChart3, path: "/candidate/results", description: "Your scores & rankings" },
  ],
};

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const items = navItems[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-blue-50/20 to-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 shadow-2xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight text-white">HackSelect AI</span>
              <span className="text-[10px] text-gray-400 capitalize">{user.role.toLowerCase()} Panel</span>
            </div>
          </Link>
          <button
            className="ml-auto lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-4">
            📍 Quick Navigation
          </p>
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="group">
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "gradient-primary text-white shadow-lg shadow-primary/50"
                      : "text-gray-300 hover:bg-slate-800/50 hover:text-white hover:shadow-md"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm leading-tight">{item.label}</div>
                    <div className={cn(
                      "text-[11px] leading-tight mt-0.5",
                      isActive ? "text-white/80" : "text-gray-400 group-hover:text-gray-200"
                    )}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0 mt-0.5" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-primary-foreground text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-300 hover:text-white hover:bg-slate-800/50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-foreground/10 flex items-center px-4 md:px-8 bg-gradient-to-r from-white/40 via-white/50 to-blue-50/40 backdrop-blur-md sticky top-0 z-30 shadow-sm">
          <button
            className="lg:hidden mr-3 p-1.5 rounded-lg hover:bg-foreground/5 transition-colors text-foreground/70"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold capitalize text-gradient">
            {user.role === "ADMIN" && "👨‍💼 Admin Dashboard"}
            {user.role === "ORGANIZER" && "🎯 Organizer Dashboard"}
            {/* ✅ Fixed: was "CANDIDATE", correct role is "STUDENT" */}
            {user.role === "STUDENT" && "📚 Candidate Dashboard"}
            {user.role === "PROCTOR" && "🛡️ Proctor Dashboard"}
          </h1>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {user.role === "ORGANIZER" && (
              <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                <Link to="/organizer/create-exam">+ New Exam</Link>
              </Button>
            )}
            {/* ✅ Fixed: was "CANDIDATE", correct role is "STUDENT" */}
            {user.role === "STUDENT" && (
              <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                <Link to="/candidate/hackathons">Browse Exams</Link>
              </Button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="h-10 w-10 rounded-xl bg-white/50 hover:bg-white/80 flex items-center justify-center transition-all duration-200 relative group shadow-sm hover:shadow-md">
              <Bell className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary text-[10px] text-white font-bold flex items-center justify-center shadow-lg">
                3
              </span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-auto bg-gradient-to-br from-background via-transparent to-blue-50/30">
          {children}
        </main>
      </div>
    </div>
  );
};