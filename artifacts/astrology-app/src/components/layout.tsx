import { ReactNode } from "react";
import { useAuth, UserButton } from "@clerk/react";
import { Link } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      {/* Decorative cosmic background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-accent/20 rounded-full mix-blend-screen filter blur-[120px]" />
      </div>
      
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-primary font-bold tracking-wider">
            CosmicRead
          </Link>
          
          <nav className="flex items-center gap-4">
            {isSignedIn && (
              <>
                <Link href="/dashboard" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Profile
                </Link>
                <UserButton afterSignOutUrl="/" appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-primary/20"
                  }
                }} />
              </>
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
