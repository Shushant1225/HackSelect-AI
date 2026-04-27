import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, Users, Trophy, LogIn, Sparkles } from "lucide-react";

const getRolePath = (role: string): string => {
  const roleMap: Record<string, string> = {
    ADMIN: "/admin",
    ORGANIZER: "/organizer",
    STUDENT: "/candidate",
    PROCTOR: "/admin",
  };
  return roleMap[role] || "/login";
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success("Logged in successfully!");
      const user = JSON.parse(localStorage.getItem("hackselect_user") || "{}");
      navigate(getRolePath(user.role));
    } else {
      toast.error("Invalid credentials. Try a demo login below.");
    }
  };

  const quickLogin = async (email: string) => {
    const success = await login(email, "password123");
    if (success) {
      toast.success("Logged in successfully!");
      const user = JSON.parse(localStorage.getItem("hackselect_user") || "{}");
      navigate(getRolePath(user.role));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-20 h-48 w-48 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">HackSelect AI</h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed">
            AI-powered proctored screening platform for hackathon organizers and candidates.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-primary-foreground/60 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <span>AI Proctoring</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <span>Auto Ranking</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <span>Shortlisting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">HackSelect AI</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          <Card className="shadow-elevated border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground h-11">
                  <LogIn className="h-4 w-4 mr-2" /> Sign In
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center mb-3 font-medium uppercase tracking-wider">Quick Demo Login (pass: password123)</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Admin", email: "admin@hackathon.com", icon: Shield },
                    { label: "Organizer", email: "organizer@hackathon.com", icon: Trophy },
                    { label: "Student", email: "student1@hackathon.com", icon: Users },
                  ].map((demo) => (
                    <Button
                      key={demo.label}
                      variant="outline"
                      size="sm"
                      className="text-xs flex-col h-auto py-2.5 gap-1 hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => quickLogin(demo.email)}
                    >
                      <demo.icon className="h-4 w-4 text-primary" />
                      {demo.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

