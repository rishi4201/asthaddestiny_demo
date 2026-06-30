import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock } from "lucide-react";

export default function Booking() {
  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">The Physical Sanctuary</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Some readings require presence. Sit across from our master astrologer in an environment designed for deep cosmic connection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Details */}
          <div className="space-y-8">
            <div className="bg-card/50 border border-border p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">Location</h3>
                <p className="text-muted-foreground leading-relaxed">
                  123 Astral Way, Suite 4B<br />
                  San Francisco, CA 94103<br />
                  <span className="text-sm mt-2 block italic">Look for the indigo door.</span>
                </p>
              </div>
            </div>

            <div className="bg-card/50 border border-border p-6 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl mb-2">The Experience</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A typical session lasts 90 minutes. We provide herbal teas formulated for clarity and ground you before we begin the reading.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" className="w-full text-lg h-14 rounded-xl" asChild>
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule via Calendly
                </a>
              </Button>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden min-h-[400px] relative shadow-lg group">
            {/* Simulated map style */}
            <div className="absolute inset-0 bg-[#1a1a2e] opacity-80" />
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle at center, #2a2a4a 0%, transparent 70%)',
              backgroundSize: '100% 100%' 
            }} />
            
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 z-10 pointer-events-none">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                <div className="w-6 h-6 bg-primary rounded-full border-4 border-background relative z-10 shadow-[0_0_15px_rgba(230,185,83,0.5)]" />
              </div>
              <span className="px-3 py-1 bg-background/80 backdrop-blur-md rounded-md text-xs font-medium border border-border shadow-lg">
                Sanctuary Location
              </span>
            </div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
