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
          <Skeleton className="h-10 w-48 mb-8 bg-muted" />
          <Skeleton className="h-64 w-full bg-muted rounded-2xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24 max-w-2xl bg-background">
        <h1 className="text-3xl font-sans font-bold mb-8 text-foreground">Your Profile</h1>

        <div className="space-y-6">
          <Card className="bg-card border-border shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="font-sans font-bold flex items-center gap-2 text-foreground">
                <UserCircle className="w-5 h-5 text-primary" />
                Personal Details
              </CardTitle>
              <CardDescription className="font-medium">Manage your account information.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-foreground">Email</Label>
                  <Input id="email" value={profile?.email || ""} disabled className="bg-muted/50 border-border" />
                  <p className="text-xs font-medium text-muted-foreground">Linked to your authentication provider.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-foreground">Preferred Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should we address you?"
                    className="bg-background border-border shadow-sm"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={upsertProfile.isPending} className="bg-accent text-accent-foreground rounded-full font-semibold px-6 hover:bg-accent/90">
                    {upsertProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border">
              <CardTitle className="font-sans font-bold flex items-center gap-2 text-foreground">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-semibold">Full Report Access</span>
                  <span className={`font-bold ${profile?.hasPaidReport ? 'text-primary' : 'text-muted-foreground'}`}>
                    {profile?.hasPaidReport ? 'Active' : 'Not Purchased'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground font-semibold">Member Since</span>
                  <span className="text-foreground font-bold">
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