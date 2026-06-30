import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useAdminGetUserQuestionnaire, 
  useAdminGetUserChat, 
  useAdminReplyChatMessage,
  getAdminGetUserChatQueryKey
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUser() {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: qData, isLoading: isQLoading } = useAdminGetUserQuestionnaire(userId);
  const { data: chatData, isLoading: isChatLoading } = useAdminGetUserChat(userId);
  const sendReply = useAdminReplyChatMessage();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatData]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await sendReply.mutateAsync({
        userId,
        data: { content: input }
      });
      setInput("");
      queryClient.invalidateQueries({ queryKey: getAdminGetUserChatQueryKey(userId) });
    } catch (error) {
      toast({ title: "Failed to send reply", variant: "destructive" });
    }
  };

  if (!userId) return null;

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-8 pb-24 h-[calc(100dvh-4rem)] flex flex-col">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-foreground">Seeker Profile</h1>
            <p className="text-xs text-muted-foreground font-mono">{userId}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
          
          {/* Questionnaire Data */}
          <Card className="bg-card border-border flex flex-col h-full overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-4 shrink-0">
              <CardTitle className="font-serif text-lg">Questionnaire Data</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-0">
              <CardContent className="p-6 space-y-6">
                {isQLoading ? (
                  <Skeleton className="h-64 w-full bg-background" />
                ) : !qData ? (
                  <div className="text-muted-foreground italic">No questionnaire data submitted.</div>
                ) : (
                  <div className="space-y-6 text-sm">
                    <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-lg border border-border">
                      <div>
                        <span className="block text-xs text-muted-foreground uppercase mb-1">Status</span>
                        <span className="font-medium">{qData.status}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground uppercase mb-1">Birth Date</span>
                        <span>{qData.birthDate || "—"}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground uppercase mb-1">Birth Time</span>
                        <span>{qData.birthTime || "—"}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground uppercase mb-1">Birth City</span>
                        <span>{qData.birthCity || "—"}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="block text-xs text-primary uppercase mb-1">Q1: Primary focus/challenge</span>
                        <p className="bg-background p-3 rounded border border-border/50">{qData.question1 || "—"}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-primary uppercase mb-1">Q2: What they seek</span>
                        <p className="bg-background p-3 rounded border border-border/50">{qData.question2 || "—"}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-primary uppercase mb-1">Q3: Repeating patterns</span>
                        <p className="bg-background p-3 rounded border border-border/50">{qData.question3 || "—"}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-primary uppercase mb-1">Q4: Processing emotions</span>
                        <p className="bg-background p-3 rounded border border-border/50">{qData.question4 || "—"}</p>
                      </div>
                      <div>
                        <span className="block text-xs text-primary uppercase mb-1">Q5: Anything else</span>
                        <p className="bg-background p-3 rounded border border-border/50">{qData.question5 || "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>

          {/* Admin Chat */}
          <Card className="bg-card border-border flex flex-col h-full overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-4 shrink-0">
              <CardTitle className="font-serif text-lg">Communication</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {isChatLoading ? (
                  <Skeleton className="h-32 w-full bg-background" />
                ) : !chatData || chatData.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">No messages yet.</div>
                ) : (
                  chatData.map((msg) => {
                    const isAdmin = msg.role === "admin";
                    return (
                      <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl p-3 ${
                          isAdmin 
                            ? 'bg-accent/20 text-foreground border border-accent/20 rounded-br-sm' 
                            : 'bg-background border border-border rounded-bl-sm'
                        }`}>
                          {!isAdmin && (
                            <span className="text-[10px] uppercase font-bold text-primary block mb-1">Seeker</span>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          
                          {msg.imageKey && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-border/50">
                              <a href={`/api/storage/objects/${msg.imageKey}`} target="_blank" rel="noopener noreferrer">
                                <img 
                                  src={`/api/storage/objects/${msg.imageKey}`} 
                                  alt="User upload" 
                                  className="w-full h-auto max-h-48 object-contain bg-black"
                                />
                              </a>
                            </div>
                          )}
                          <span className="text-[10px] text-muted-foreground block mt-1 opacity-60 text-right">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border/50 bg-muted/20 shrink-0">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send wisdom..."
                  className="bg-background"
                  disabled={sendReply.isPending}
                />
                <Button type="submit" disabled={!input.trim() || sendReply.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>

        </div>
      </div>
    </Layout>
  );
}
