import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";

export default function Booking() {
  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-4xl bg-background">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-sans font-bold mb-6 text-foreground">In-Person Consultation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Book a face-to-face reading with our expert astrologers in a professional, private setting.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Details */}
          <div className="space-y-8">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-xl mb-2 text-foreground">Location</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  123 Cosmic Way, Suite 4B<br />
                  San Francisco, CA 94103<br />
                </p>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-xl mb-2 text-foreground">The Experience</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  A typical session lasts 90 minutes. Professional chart analysis, palm reading, and direct Q&A.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" className="w-full text-lg h-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-sm" asChild>
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule via Calendly
                </a>
              </Button>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-muted border border-border rounded-3xl overflow-hidden min-h-[400px] relative shadow-inner group">
            {/* Minimal simulated map style */}
            <div className="absolute inset-0 bg-muted" />
            
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 z-10 pointer-events-none">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                <div className="w-6 h-6 bg-primary rounded-full border-4 border-background relative z-10 shadow-sm" />
              </div>
              <span className="px-3 py-1 bg-card rounded-md text-xs font-bold text-foreground border border-border shadow-sm">
                San Francisco Office
              </span>
            </div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}