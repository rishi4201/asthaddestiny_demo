import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent, useGetPaymentStatus } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Lock, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe outside component to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Handle redirect locally to avoid losing state
    });

    if (error) {
      toast({ 
        title: "Payment failed", 
        description: error.message || "An unexpected error occurred.",
        variant: "destructive" 
      });
      setIsLoading(false);
    } else {
      // Success!
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-background/50 rounded-xl border border-border">
        <PaymentElement options={{ 
          theme: 'night',
          variables: {
            colorPrimary: '#e6b953',
            colorBackground: '#1a1025',
            colorText: '#faebd7',
            colorDanger: '#df1b41',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          }
        }} />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Lock className="w-5 h-5 mr-2" />
        )}
        Pay $49.00
      </Button>
      
      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" /> Secure encrypted payment
      </p>
    </form>
  );
}

export default function Payment() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const { data: status, isLoading: isStatusLoading } = useGetPaymentStatus();
  const createIntent = useCreatePaymentIntent();

  useEffect(() => {
    // If already paid, redirect away
    if (status?.hasPaidReport) {
      setLocation("/dashboard");
      return;
    }

    // Initialize payment intent
    if (!status?.hasPaidReport && !clientSecret && !createIntent.isPending && !createIntent.isSuccess) {
      createIntent.mutateAsync({
        data: { amount: 4900, currency: "usd" }
      }).then(res => {
        setClientSecret(res.clientSecret);
      });
    }
  }, [status, clientSecret, createIntent, setLocation]);

  if (isStatusLoading || (!clientSecret && createIntent.isPending)) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-12 max-w-4xl">
          <Skeleton className="h-12 w-64 mx-auto mb-12 bg-card" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full bg-card rounded-2xl" />
            <Skeleton className="h-96 w-full bg-card rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium tracking-wide mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Deepen Your Insight
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground">Unlock the Full Report</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* What's included */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif mb-6 text-primary">Your comprehensive reading includes:</h2>
              <ul className="space-y-4">
                {[
                  "Detailed natal chart analysis (Sun, Moon, Rising, Houses)",
                  "Current planetary transits and how they affect your path",
                  "Deep dive into your palm's major and minor lines",
                  "Direct ongoing chat access to your seer",
                  "Priority booking for physical sanctuary visits",
                  "Life cycle timing and predictions"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-card/40 border border-border rounded-2xl italic text-muted-foreground">
              "The universe speaks in whispers. A full reading amplifies that voice, giving you the clarity needed to navigate your destiny."
            </div>
          </div>

          {/* Payment Form */}
          <Card className="bg-card/80 backdrop-blur-md border-primary/20 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-serif">Complete Purchase</CardTitle>
              <CardDescription className="text-base mt-2">One-time payment of <strong className="text-foreground">$49.00</strong></CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                  <CheckoutForm clientSecret={clientSecret} onSuccess={() => setLocation("/dashboard")} />
                </Elements>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  Initializing secure gateway...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
