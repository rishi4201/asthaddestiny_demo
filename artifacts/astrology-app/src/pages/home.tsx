import { Link, Redirect } from "wouter";
import { useAuth } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { Star, MessageCircle, Hand, Users, CheckCircle2, Sparkles } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col pt-12 md:pt-20 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl text-left space-y-8">
              <h1 className="text-5xl md:text-7xl font-sans font-bold text-foreground leading-[1.1]">
                Talk to <br />
                <span className="text-primary">Astrologers</span> <br />
                right now.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Get guidance on love, career, and life. Submit your birth details and palm photo for a personalized reading from verified experts.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-base px-8 h-14 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90">
                    Start Free Reading
                  </Button>
                </Link>
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-base px-8 h-14 rounded-full border-border bg-card hover:bg-muted font-medium">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-6 flex items-center gap-4 border-t border-border mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center z-[${5-i}]`}>
                      <span className="text-xs font-bold text-muted-foreground">{String.fromCharCode(64 + i)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center text-accent mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm font-medium text-foreground">Trusted by 50,000+ users</p>
                </div>
              </div>
            </div>

            {/* Right Illustration (CSS only) */}
            <div className="flex-1 w-full max-w-lg hidden md:block">
              <div className="relative w-full aspect-square rounded-full flex items-center justify-center">
                {/* Concentric rings */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-primary/20 animate-[spin_45s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-primary/20" />
                <div className="absolute inset-24 rounded-full border border-primary/30 border-dashed animate-[spin_30s_linear_infinite]" />
                
                {/* Zodiac signs placeholders */}
                <div className="absolute w-full h-full animate-[spin_60s_linear_infinite]">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute top-0 left-1/2 -ml-3 w-6 h-6 flex items-center justify-center text-primary/40 text-xs font-bold" style={{ transform: `rotate(${i * 30}deg) translateY(-10px)` }}>
                      ✧
                    </div>
                  ))}
                </div>

                {/* Constellation lines */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400">
                  <path d="M150,100 L250,150 L200,250 L100,200 Z" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1" />
                  <path d="M250,150 L300,100" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1" />
                  <path d="M200,250 L250,300" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1" />
                  
                  {/* Dots */}
                  <circle cx="150" cy="100" r="3" className="fill-primary" />
                  <circle cx="250" cy="150" r="4" className="fill-primary" />
                  <circle cx="200" cy="250" r="3" className="fill-primary" />
                  <circle cx="100" cy="200" r="4" className="fill-primary" />
                  <circle cx="300" cy="100" r="2" className="fill-primary" />
                  <circle cx="250" cy="300" r="2" className="fill-primary" />
                </svg>

                {/* Center Sun/Orb */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-accent to-primary shadow-[0_0_50px_rgba(249,115,22,0.3)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm mix-blend-overlay" />
                  <Sparkles className="w-10 h-10 text-white relative z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* How it works */}
        <div className="mt-32 bg-muted/50 py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-sans font-bold text-center mb-16 text-foreground">How CosmicRead Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-3 text-foreground">1. Birth Details</h3>
                <p className="text-muted-foreground leading-relaxed">Provide your exact time and place of birth to construct your cosmic blueprint.</p>
              </div>
              
              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Hand className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-3 text-foreground">2. Reveal Your Palm</h3>
                <p className="text-muted-foreground leading-relaxed">Upload a clear photo of your dominant hand to uncover your life lines.</p>
              </div>
              
              <div className="bg-card border border-border p-8 rounded-2xl shadow-sm text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-sans mb-3 text-foreground">3. Receive Guidance</h3>
                <p className="text-muted-foreground leading-relaxed">Chat directly with your astrologer to navigate your past, present, and future.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="mt-24 container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-sans font-bold mb-8 text-foreground">Speak to Expert Astrologers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Our platform connects you with experienced professionals who understand the intricate details of your chart.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            {["Verified Experts", "100% Confidential", "Accurate Readings", "24/7 Availability"].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}