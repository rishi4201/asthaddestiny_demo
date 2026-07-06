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
      <div className="p-4 bg-background rounded-xl border border-border">
        <PaymentElement options={{ 
          theme: 'stripe',
          variables: {
            colorPrimary: '#F97316',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          }
        }} />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-full shadow-sm"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Lock className="w-5 h-5 mr-2" />
        )}
        Pay $49.00
      </Button>
      
      <p className="text-center text-xs font-semibold text-muted-foreground flex items-center justify-center gap-1">
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
          <Skeleton className="h-12 w-64 mx-auto mb-12 bg-muted" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full bg-muted rounded-2xl" />
            <Skeleton className="h-96 w-full bg-muted rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-5xl bg-background">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-semibold tracking-wide mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Deepen Your Insight
          </div>
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-foreground">Unlock the Full Report</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* What's included */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-sans font-bold mb-6 text-foreground">Your comprehensive reading includes:</h2>
              <ul className="space-y-4">
                {[
                  "Detailed natal chart analysis (Sun, Moon, Rising, Houses)",
                  "Current planetary transits and how they affect your path",
                  "Deep dive into your palm's major and minor lines",
                  "Direct ongoing chat access to your astrologer",
                  "Priority booking for physical sanctuary visits",
                  "Life cycle timing and predictions"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-muted/50 border border-border rounded-2xl italic text-foreground font-medium">
              "A full reading amplifies clarity, giving you the insights needed to navigate your destiny with confidence."
            </div>
          </div>

          {/* Payment Form */}
          <Card className="bg-card border border-border shadow-md rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <CardHeader className="pb-6 bg-muted/20 border-b border-border">
              <CardTitle className="text-2xl font-sans font-bold text-foreground">Complete Purchase</CardTitle>
              <CardDescription className="text-base mt-2 font-medium">One-time payment of <strong className="text-foreground">$49.00</strong></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <CheckoutForm clientSecret={clientSecret} onSuccess={() => setLocation("/dashboard")} />
                </Elements>
              ) : (
                <div className="p-12 text-center text-muted-foreground font-semibold">
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