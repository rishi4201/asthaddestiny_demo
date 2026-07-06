import { ReactNode } from "react";
import { useAuth, UserButton } from "@clerk/react";
import { Link } from "wouter";
import { Button } from "./ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-sans text-xl text-foreground font-bold flex items-center gap-1">
            Cosmic<span className="text-primary">Read</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/chat" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">
                  Chat
                </Link>
                <Link href="/booking" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">
                  Booking
                </Link>
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }} />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/sign-up">
                  <Button className="rounded-full px-4 h-9 bg-accent text-accent-foreground hover:bg-accent/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col">
        {children}
      </main>
    </div>
  );
}
