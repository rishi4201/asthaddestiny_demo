import { useEffect } from "react";
import { useUser } from "@clerk/react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyProfile, useGetMyQuestionnaire, useGetTeaser, useGetChatMessages } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, MessageCircle, Star, ArrowRight, BookOpen } from "lucide-react";

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile();
  const { data: questionnaire, isLoading: isQuestionnaireLoading } = useGetMyQuestionnaire();
  const { data: teaser, isLoading: isTeaserLoading } = useGetTeaser({ query: { enabled: questionnaire?.status === "submitted" } });
  const { data: chatMessages, isLoading: isChatLoading } = useGetChatMessages();

  useEffect(() => {
    if (isUserLoaded && !user) {
      setLocation("/sign-in");
    }
  }, [user, isUserLoaded, setLocation]);

  if (!isUserLoaded || !user || isProfileLoading || isQuestionnaireLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-8">
          <Skeleton className="h-10 w-48 mb-8 bg-muted" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full bg-muted" />
            <Skeleton className="h-64 w-full bg-muted" />
          </div>
        </div>
      </Layout>
    );
  }

  const hasDraft = questionnaire && questionnaire.status === "draft";
  const hasSubmitted = questionnaire && questionnaire.status === "submitted";
  const recentChat = chatMessages && chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-8 pb-20 bg-background">
        <h1 className="text-3xl font-sans font-bold mb-8 text-foreground">Welcome, {profile?.name || user.firstName || "Seeker"}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-sm overflow-hidden relative rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <CardHeader>
              <CardTitle className="font-sans font-bold flex items-center gap-2 text-foreground">
                <Star className="w-5 h-5 text-primary" />
                Your Cosmic Reading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!questionnaire && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Your journey begins with a few questions about your birth and life path.</p>
                  <Link href="/questionnaire">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold">Start Questionnaire</Button>
                  </Link>
                </div>
              )}
              {hasDraft && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You have an unfinished questionnaire. We await your remaining details.</p>
                  <Link href="/questionnaire">
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold">Continue Questionnaire</Button>
                  </Link>
                </div>
              )}
              {hasSubmitted && (
                <div className="space-y-4">
                  {isTeaserLoading ? (
                    <Skeleton className="h-20 w-full bg-muted" />
                  ) : teaser ? (
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <div className="flex gap-4 mb-4 justify-center">
                        <div className="text-center">
                          <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest">Sun</span>
                          <span className="font-sans font-bold text-primary">{teaser.sunSign}</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest">Moon</span>
                          <span className="font-sans font-bold text-primary">{teaser.moonSign}</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest">Rising</span>
                          <span className="font-sans font-bold text-primary">{teaser.ascendant}</span>
                        </div>
                      </div>
                      <p className="text-sm italic text-center text-foreground">"{teaser.teaserText}"</p>
                    </div>
                  ) : null}

                  {!profile?.hasPaidReport ? (
                    <div className="mt-6 bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
                      <h3 className="font-sans font-bold text-lg mb-2 text-foreground">Unlock Your Full Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">Discover the deep insights of your birth chart and palm lines.</p>
                      <Link href="/payment">
                        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold shadow-sm">
                          Upgrade to Full Report
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 text-center">
                      <Link href="/profile">
                        <Button variant="outline" className="w-full rounded-full border-border hover:bg-muted font-semibold">
                          <BookOpen className="w-4 h-4 mr-2 text-primary" />
                          View Full Report
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="font-sans font-bold flex items-center gap-2 text-foreground">
                <MessageCircle className="w-5 h-5 text-primary" />
                Sanctum Chat
              </CardTitle>
              <CardDescription>Speak directly with your astrologer</CardDescription>
            </CardHeader>
            <CardContent>
              {isChatLoading ? (
                <Skeleton className="h-20 w-full bg-muted" />
              ) : recentChat ? (
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <span className="text-xs font-semibold text-muted-foreground mb-1 block">
                    {recentChat.role === "user" ? "You" : "Astrologer"}
                  </span>
                  <p className="text-sm line-clamp-2 text-foreground">
                    {recentChat.content || (recentChat.imageUrl ? "Uploaded an image" : "Message")}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Your chat is quiet. Begin a conversation or upload your palm photo.
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/chat" className="w-full">
                <Button variant="outline" className="w-full group rounded-full border-border hover:bg-muted font-semibold">
                  Enter Chat
                  <ArrowRight className="w-4 h-4 ml-2 text-primary group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {profile?.hasPaidReport && (
            <Card className="bg-card border-border shadow-sm rounded-2xl lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-sans font-bold flex items-center gap-2 text-foreground">
                  <Sparkles className="w-5 h-5 text-primary" />
                  In-Person Consultation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-muted-foreground text-sm">
                  Ready to delve deeper? Schedule an in-person reading at our physical sanctuary.
                </p>
                <Link href="/booking">
                  <Button className="rounded-full bg-primary text-primary-foreground font-semibold px-6">Book Visit</Button>
                </Link>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </Layout>
  );
}