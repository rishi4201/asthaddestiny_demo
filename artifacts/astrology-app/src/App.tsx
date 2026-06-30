import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, SignIn, SignUp, useClerk } from "@clerk/react";
import { dark } from "@clerk/themes";
import { useEffect, useRef } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Questionnaire from "@/pages/questionnaire";
import QuestionnaireResult from "@/pages/questionnaire-result";
import Chat from "@/pages/chat";
import Booking from "@/pages/booking";
import Payment from "@/pages/payment";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import AdminUser from "@/pages/admin-user";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  baseTheme: dark,
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#e6b953",
    colorBackground: "#1a1025",
    colorInput: "#261a35",
    colorInputForeground: "#faebd7",
    colorForeground: "#faebd7",
    colorText: "#faebd7",
    fontFamily: "'Playfair Display', serif",
    borderRadius: "0.75rem",
  },
  elements: {
    cardBox: "w-[440px] max-w-full overflow-hidden bg-card border border-border shadow-xl rounded-2xl",
    card: "bg-transparent border-0 shadow-none",
    headerTitle: "text-foreground font-serif text-2xl",
    headerSubtitle: "text-muted-foreground",
    formFieldLabel: "text-foreground",
    formFieldInput: "bg-input border-border text-foreground rounded-md",
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 font-medium",
    footerActionText: "text-muted-foreground",
    footerActionLink: "text-primary hover:text-primary/80",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground",
  }
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="relative z-10">
        <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="relative z-10">
        <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/questionnaire" component={Questionnaire} />
          <Route path="/questionnaire/result" component={QuestionnaireResult} />
          <Route path="/chat" component={Chat} />
          <Route path="/booking" component={Booking} />
          <Route path="/payment" component={Payment} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/users/:userId" component={AdminUser} />
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;