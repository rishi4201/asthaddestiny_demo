import { useEffect, useState, useRef } from "react";
import { useGetMyProfile, useUpsertMyProfile } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCircle, ShieldCheck } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetMyProfile();
  const upsertProfile = useUpsertMyProfile();
  
  const [name, setName] = useState("");
  const initRef = useRef(false);

  useEffect(() => {
    if (profile && !initRef.current) {
      setName(profile.name || "");
      initRef.current = true;
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertProfile.mutateAsync({
        data: { name }
      });
      toast({ title: "Profile updated successfully" });
    } catch (error) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-12 max-w-2xl">
          <Skeleton className="h-10 w-48 mb-8 bg-card" />
          <Skeleton className="h-64 w-full bg-card" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-2xl">
        <h1 className="text-3xl font-serif mb-8 text-foreground">Your Identity</h1>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                Personal Details
              </CardTitle>
              <CardDescription>How you are known in the sanctum.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || ""} disabled className="bg-muted/50" />
                  <p className="text-xs text-muted-foreground">Linked to your authentication provider.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Preferred Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should we address you?"
                    className="bg-background"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={upsertProfile.isPending}>
                    {upsertProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Full Report Access</span>
                  <span className={`font-medium ${profile?.hasPaidReport ? 'text-primary' : 'text-muted-foreground'}`}>
                    {profile?.hasPaidReport ? 'Active' : 'Not Purchased'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-foreground">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
