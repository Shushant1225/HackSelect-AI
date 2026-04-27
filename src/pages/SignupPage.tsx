import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Users, Trophy, Shield, UserPlus, Sparkles, CheckCircle2 } from "lucide-react";

const roles: { value: UserRole; label: string; icon: typeof Users; desc: string }[] = [
  { value: "candidate", label: "Candidate", icon: Users, desc: "Take screening tests" },
  { value: "organizer", label: "Organizer", icon: Trophy, desc: "Create & manage exams" },
  { value: "admin", label: "Admin", icon: Shield, desc: "Manage the platform" },
];

const getRolePath = (role: string): string => {
  const roleMap: Record<string, string> = {
    candidate: "/candidate",
    organizer: "/organizer",
    admin: "/admin",
  };
  return roleMap[role] || "/login";
};

const getRoleForBackend = (uiRole: string): string => {
  const roleMap: Record<string, string> = {
    candidate: "STUDENT",
    organizer: "ORGANIZER",
    admin: "ADMIN",
  };
  return roleMap[uiRole] || "STUDENT";
};

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const backendRole = getRoleForBackend(role);
    const success = await signup(name, email, password, backendRole);
    if (success) {
      toast.success("Account created successfully!");
      navigate(getRolePath(role));
    } else {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 right-20 h-64 w-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-32 left-20 h-48 w-48 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="h-20 w-20 rounded-2xl gradient-accent flex items-center justify-center mb-6 animate-pulse-glow">
            <Sparkles className="h-10 w-10 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-4">Join HackSelect AI</h1>
          <p className="text-primary-foreground/70 text-lg leading-relaxed mb-8">
            Create an account and start your journey with AI-powered hackathon screening.
          </p>
          <div className="space-y-3">
            {[
              "AI-powered proctoring system",
              "Automated scoring & ranking",
              "Real-time analytics dashboard",
              "Fair & transparent shortlisting",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-primary-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
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
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-muted-foreground mt-1">Choose your role and get started</p>
          </div>

          <Card className="shadow-elevated border-border/50">
            <CardContent className="p-6">
              {/* Role selector */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center",
                      role === r.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <r.icon className={cn("h-5 w-5", role === r.value ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-medium">{r.label}</span>
                    <span className="text-[10px] text-muted-foreground">{r.desc}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground h-11">
                  <UserPlus className="h-4 w-4 mr-2" /> Create Account
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
