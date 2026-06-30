import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetTeaser } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Moon, Sun, ArrowRight } from "lucide-react";

export default function QuestionnaireResult() {
  const [, setLocation] = useLocation();
  const { data: teaser, isLoading } = useGetTeaser();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-12 flex flex-col items-center max-w-lg">
          <Skeleton className="h-12 w-64 mb-12 bg-card rounded-full" />
          <Skeleton className="h-64 w-full bg-card rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!teaser) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-12 text-center">
          <p>No teaser available. Please submit your details first.</p>
          <Button onClick={() => setLocation("/questionnaire")} className="mt-4">Go to Questionnaire</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-2xl flex flex-col items-center">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium tracking-wide mb-8">
          <Sparkles className="w-4 h-4 mr-2" />
          The Universe Has Responded
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12 leading-tight">
          A glimpse into your <br /> cosmic architecture
        </h1>

        <div className="w-full bg-card/60 backdrop-blur-md border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sun className="w-32 h-32" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
            <div className="text-center p-4 bg-background/50 rounded-2xl border border-border/50">
              <span className="block text-xs text-muted-foreground uppercase tracking-widest mb-2">Sun</span>
              <span className="font-serif text-2xl text-primary">{teaser.sunSign}</span>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-2xl border border-border/50">
              <span className="block text-xs text-muted-foreground uppercase tracking-widest mb-2">Moon</span>
              <span className="font-serif text-2xl text-primary">{teaser.moonSign}</span>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-2xl border border-border/50">
              <span className="block text-xs text-muted-foreground uppercase tracking-widest mb-2">Rising</span>
              <span className="font-serif text-2xl text-primary">{teaser.ascendant}</span>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <p className="text-xl md:text-2xl font-serif text-foreground/90 italic text-center leading-relaxed">
              "{teaser.teaserText}"
            </p>

            <div className="flex justify-center gap-8 pt-6 border-t border-border/50">
              {teaser.element && (
                <div className="text-center">
                  <span className="block text-xs text-muted-foreground uppercase tracking-widest">Dominant Element</span>
                  <span className="font-serif text-lg text-foreground">{teaser.element}</span>
                </div>
              )}
              {teaser.luckyNumber && (
                <div className="text-center">
                  <span className="block text-xs text-muted-foreground uppercase tracking-widest">Lucky Number</span>
                  <span className="font-serif text-lg text-foreground">{teaser.luckyNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 w-full text-center space-y-6">
          <h2 className="text-2xl font-serif">The profound insights await</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This is merely the surface. To delve into the intricate weave of your life path, transit, and palm lines, unlock your full reading.
          </p>
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-10 h-14 rounded-full shadow-[0_0_20px_rgba(230,185,83,0.2)] hover:shadow-[0_0_30px_rgba(230,185,83,0.4)] transition-all text-lg"
            onClick={() => setLocation("/payment")}
          >
            Unlock Full Report
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <div className="pt-4">
             <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setLocation("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
