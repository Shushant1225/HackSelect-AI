import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield, Brain, Clock, Users, CheckCircle, ChevronRight,
  BarChart3, Eye, Zap, ArrowRight, Trophy, Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const features = [
  { icon: Brain, title: "AI-Powered Evaluation", desc: "Automated scoring with intelligent grading for objective and subjective questions." },
  { icon: Shield, title: "Smart Proctoring", desc: "Tab switch detection, webcam monitoring, and suspicious activity logging in real-time." },
  { icon: Clock, title: "Timed Examinations", desc: "Auto-timed exams with question navigation, auto-save, and submission deadlines." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Rich analytics with charts, rankings, and performance insights at a glance." },
  { icon: Eye, title: "Fair Shortlisting", desc: "Rank candidates by score, filter by violations, and shortlist top talent objectively." },
  { icon: Users, title: "Multi-Role Access", desc: "Separate dashboards for admins, organizers, and candidates with role-based access." },
];

const steps = [
  { step: "01", title: "Create Hackathon", desc: "Organizers set up hackathon details, eligibility, and exam parameters." },
  { step: "02", title: "Add Questions", desc: "Build MCQ, coding, or theoretical question sets with marks allocation." },
  { step: "03", title: "Candidates Apply", desc: "Students browse, register, and take proctored screening exams." },
  { step: "04", title: "Auto Evaluate", desc: "Scores are calculated, candidates ranked, and top performers shortlisted." },
];

const stats = [
  { value: "50+", label: "Hackathons Hosted" },
  { value: "10K+", label: "Candidates Screened" },
  { value: "98%", label: "Fair Selection Rate" },
  { value: "4.9★", label: "Organizer Rating" },
];

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);

  const getDashboardPath = () => {
    if (!user) return "/login";
    const roleMap: Record<string, string> = {
      ADMIN: "/admin",
      ORGANIZER: "/organizer",
      STUDENT: "/candidate",
      PROCTOR: "/admin",
    };
    return roleMap[user.role] || "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-primary-foreground font-bold text-sm">HS</span>
            </div>
            <span className="font-bold text-lg text-gradient">HackSelect AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {/* Features Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setShowFeaturesMenu(!showFeaturesMenu)}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary/5 flex items-center gap-1"
              >
                ✨ Features
                <ChevronRight className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              </button>
              
              {/* Dropdown Menu */}
              {showFeaturesMenu && (
                <div className="absolute top-12 left-0 w-80 bg-white border border-foreground/10 rounded-xl shadow-xl p-0 animate-fade-in">
                  <div className="grid grid-cols-1 gap-0">
                    {features.map((f, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setShowFeaturesMenu(false);
                          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-3 hover:bg-blue-50 border-b border-foreground/5 last:border-b-0 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <f.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-foreground group-hover:text-primary">{f.title}</p>
                            <p className="text-xs text-foreground/60">{f.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary/5">
              📋 How It Works
            </a>
            <a href="#why-us" className="text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary/5">
              🏆 Why Us
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button className="gradient-primary text-primary-foreground btn-glow" asChild>
                <Link to={getDashboardPath()}>🚀 Dashboard <ChevronRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="text-foreground/70 hover:text-foreground hidden sm:flex" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="gradient-primary text-primary-foreground btn-glow flex items-center gap-1" asChild>
                  <Link to="/signup">✨ Get Started <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-40 pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-primary/30 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="h-4 w-4" />
            AI-Powered Hackathon Screening Platform
          </div>
          
          <h1 className="mb-6 animate-slide-up">
            Screen Smarter.{" "}
            <span className="text-gradient-accent">Shortlist Faster.</span>
          </h1>
          
          <p className="text-lg text-foreground/70 mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            HackSelect AI helps organizers create proctored screening exams, auto-evaluate candidates, and shortlist the best talent — fairly and efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="gradient-primary text-primary-foreground px-8 py-4 text-base font-semibold btn-glow hover:scale-105" asChild>
              <Link to="/signup">Create Exam <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-4 text-base font-semibold transition-all duration-300" asChild>
              <Link to="/signup">Try Free <Trophy className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((s, index) => (
              <div key={s.label} className="animate-slide-up group" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/80 hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{s.value}</p>
                  <p className="text-sm text-foreground/70">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-green-50/50 pointer-events-none"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-primary bg-blue-100 mb-4">
              ✨ Powerful Features
            </span>
            <h2 className="mb-4">Everything You Need</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to run fair, efficient, and professional hackathon screenings.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, index) => (
              <Card key={f.title} className="group shadow-sm hover:shadow-xl card-hover relative overflow-hidden border border-foreground/10 bg-white/80 backdrop-blur-sm animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <f.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{f.desc}</p>
                  <div className="mt-6 flex items-center text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Learn more <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modern How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-green-600 bg-green-100 mb-4">
              📋 Simple Process
            </span>
            <h2 className="mb-4">How It Works</h2>
            <p className="text-lg text-foreground/70">
              Four simple steps from exam creation to candidate shortlisting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {steps.map((s, index) => (
              <div key={s.step} className="flex gap-6 items-start animate-slide-up group" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <span className="text-primary-foreground font-bold text-lg">{s.step}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-primary/20 shadow-md">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold">Ready to get started?</span>
              <Button size="sm" className="gradient-primary text-primary-foreground ml-2" asChild>
                <Link to="/signup">Create Your First Exam</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Why Choose Us Section */}
      <section id="why-us" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-amber-600 bg-amber-100 mb-4">
            🏆 Why Choose Us
          </span>
          <h2 className="mb-4">We Solve Your Pain Points</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-16">
            We solve the biggest pain points in hackathon candidate selection.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Fair & Unbiased", desc: "Standardized evaluation removes subjective bias from shortlisting.", color: "from-amber-500 to-orange-500" },
              { icon: Zap, title: "Lightning Fast", desc: "Auto-evaluate hundreds of submissions in seconds, not hours.", color: "from-blue-500 to-cyan-500" },
              { icon: CheckCircle, title: "Enterprise Ready", desc: "Proctored exams with activity monitoring ensure exam integrity.", color: "from-green-500 to-emerald-500" },
            ].map((item, index) => (
              <div key={item.title} className="animate-slide-up group" style={{ animationDelay: `${index * 0.15}s` }}>
                <Card className="shadow-sm hover:shadow-xl card-hover bg-white/80 backdrop-blur-sm border border-foreground/10 h-full">
                  <CardContent className="p-8 text-center">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="gradient-hero py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-accent/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Hackathons?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of organizers who trust HackSelect AI for fair, unbiased, and efficient candidate screening.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="gradient-accent text-white px-10 py-4 text-lg font-semibold btn-glow hover:scale-105" asChild>
              <Link to="/signup">Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <div className="text-white/70 text-sm space-y-1">
              <div>✓ No setup fees</div>
              <div>✓ Cancel anytime</div>
              <div>✓ 24/7 support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-sm">HS</span>
                </div>
                <div>
                  <span className="font-bold text-lg text-white">HackSelect</span>
                  <span className="text-gray-400 ml-1">AI</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Revolutionizing hackathon candidate screening with AI-powered evaluation, real-time proctoring, and fair shortlisting.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#why-us" className="hover:text-white transition-colors">Why Us</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2025 HackSelect AI. Built for fair hackathon screening.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
