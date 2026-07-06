import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetTeaser } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ArrowRight } from "lucide-react";

export default function QuestionnaireResult() {
  const [, setLocation] = useLocation();
  const { data: teaser, isLoading } = useGetTeaser();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-12 flex flex-col items-center max-w-lg">
          <Skeleton className="h-12 w-64 mb-12 bg-muted rounded-full" />
          <Skeleton className="h-64 w-full bg-muted rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!teaser) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-12 text-center">
          <p className="text-foreground">No teaser available. Please submit your details first.</p>
          <Button onClick={() => setLocation("/questionnaire")} className="mt-4 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90">Go to Questionnaire</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-2xl flex flex-col items-center">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-semibold tracking-wide mb-8">
          <Sparkles className="w-4 h-4 mr-2" />
          Your Reading Teaser
        </div>

        <h1 className="text-4xl md:text-5xl font-sans font-bold text-center mb-12 text-foreground leading-tight">
          A glimpse into your <br /> cosmic profile
        </h1>

        <div className="w-full bg-card border border-border rounded-3xl p-8 shadow-md relative overflow-hidden">
          <div className="grid grid-cols-3 gap-4 mb-10 relative z-10">
            <div className="text-center p-4 bg-muted/50 rounded-2xl border border-border/50">
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Sun</span>
              <span className="font-sans font-bold text-2xl text-primary">{teaser.sunSign}</span>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-2xl border border-border/50">
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Moon</span>
              <span className="font-sans font-bold text-2xl text-primary">{teaser.moonSign}</span>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-2xl border border-border/50">
              <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Rising</span>
              <span className="font-sans font-bold text-2xl text-primary">{teaser.ascendant}</span>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <p className="text-xl md:text-2xl font-sans font-medium text-foreground italic text-center leading-relaxed">
              "{teaser.teaserText}"
            </p>

            <div className="flex justify-center gap-8 pt-8 border-t border-border/50">
              {teaser.element && (
                <div className="text-center">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Dominant Element</span>
                  <span className="font-sans font-bold text-lg text-foreground">{teaser.element}</span>
                </div>
              )}
              {teaser.luckyNumber && (
                <div className="text-center">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Lucky Number</span>
                  <span className="font-sans font-bold text-lg text-foreground">{teaser.luckyNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 w-full text-center space-y-6">
          <h2 className="text-2xl font-sans font-bold text-foreground">The profound insights await</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This is merely the surface. To delve into the intricate weave of your life path, transit, and palm lines, unlock your full reading.
          </p>
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-10 h-14 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-sm text-lg"
            onClick={() => setLocation("/payment")}
          >
            Unlock Full Report
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <div className="pt-4">
             <Button variant="ghost" className="text-muted-foreground font-semibold hover:text-foreground rounded-full" onClick={() => setLocation("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}