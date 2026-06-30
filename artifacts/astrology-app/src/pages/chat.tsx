import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetChatMessages, 
  useSendChatMessage, 
  useRequestUploadUrl,
  getGetChatMessagesQueryKey 
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useGetChatMessages();
  const sendMessage = useSendChatMessage();
  const requestUpload = useRequestUploadUrl();

  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    try {
      await sendMessage.mutateAsync({
        data: { content: input }
      });
      setInput("");
      queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey() });
    } catch (error) {
      toast({ title: "Failed to send message", variant: "destructive" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const { uploadUrl, objectKey } = await requestUpload.mutateAsync({
        data: { filename: file.name, contentType: file.type }
      });

      // 2. Upload file directly to storage
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type }
      });

      // 3. Send message with image ref
      await sendMessage.mutateAsync({
        data: { content: "I've shared a photo of my palm.", imageKey: objectKey }
      });

      queryClient.invalidateQueries({ queryKey: getGetChatMessagesQueryKey() });
      toast({ title: "Photo sent successfully" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col h-[calc(100dvh-4rem)]">
        {/* Chat Header */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-md p-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg">Sanctum Chat</h2>
            <p className="text-xs text-muted-foreground">Your astrologer is attentive.</p>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-6 pb-4 max-w-3xl mx-auto w-full">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <Skeleton className="h-16 w-64 bg-card rounded-2xl" />
                </div>
              ))
            ) : messages?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground space-y-4">
                <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p>Upload a clear photo of your dominant hand to begin.</p>
              </div>
            ) : (
              messages?.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      isUser 
                        ? 'bg-primary/20 text-foreground border border-primary/20 rounded-br-sm' 
                        : 'bg-card border border-border rounded-bl-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      
                      {msg.imageKey && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border/50">
                          <img 
                            src={`/api/storage/objects/${msg.imageKey}`} 
                            alt="Palm upload" 
                            className="w-full h-auto max-h-64 object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <span className="text-[10px] text-muted-foreground block mt-2 opacity-60">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            
            {isUploading && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl p-4 bg-primary/10 border border-primary/20 rounded-br-sm flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Transmitting image...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSend} className="flex items-end gap-2 relative">
              <div className="flex-1 bg-card border border-border rounded-2xl flex items-end p-1 focus-within:border-primary/50 transition-colors">
                
                {/* Hidden file input */}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Camera className="w-5 h-5" />
                </Button>
                
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-10 px-2"
                  disabled={isUploading}
                />
              </div>
              
              <Button 
                type="submit" 
                size="icon" 
                className="h-12 w-12 rounded-2xl shrink-0 bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20"
                disabled={!input.trim() || isUploading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
