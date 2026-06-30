import { Link, Redirect } from "wouter";
import { useAuth } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { Star, Sparkles, Hand } from "lucide-react";

export default function Home() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col pt-12 md:pt-24 pb-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-10 max-w-3xl">
          
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium tracking-wide">
            <Sparkles className="w-4 h-4 mr-2" />
            Discover Your True Path
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
            A Personal Journey <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-foreground to-primary">Through the Stars</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Step into the inner sanctum. Submit your birth details and a photograph of your palm, and receive a deeply personal reading from our master astrologer.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 h-14 rounded-full shadow-[0_0_20px_rgba(230,185,83,0.3)] hover:shadow-[0_0_30px_rgba(230,185,83,0.5)] transition-all">
                Begin Your Reading
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-14 rounded-full border-primary/20 hover:bg-primary/10">
                Return to Sanctum
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-32 container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-serif text-center mb-16">How the Universe Reveals You</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif">1. Share Your Chart</h3>
              <p className="text-muted-foreground">Provide your exact time and place of birth to construct your cosmic blueprint.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Hand className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif">2. Reveal Your Palm</h3>
              <p className="text-muted-foreground">Upload a clear photo of your dominant hand to uncover your life lines.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif">3. Receive Guidance</h3>
              <p className="text-muted-foreground">Communicate directly with your seer to navigate your past, present, and future.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
