import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetMyProfile, useAdminGetStats, useAdminListUsers } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, CreditCard, Activity } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: isProfileLoading } = useGetMyProfile();
  
  const isAdmin = profile?.isAdmin === true;

  const { data: stats, isLoading: isStatsLoading } = useAdminGetStats({ query: { enabled: isAdmin } });
  const { data: users, isLoading: isUsersLoading } = useAdminListUsers({ query: { enabled: isAdmin } });

  useEffect(() => {
    if (!isProfileLoading && profile && !isAdmin) {
      setLocation("/dashboard");
    }
  }, [profile, isProfileLoading, isAdmin, setLocation]);

  if (isProfileLoading || !profile || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-12">
          <Skeleton className="h-10 w-48 mb-8 bg-card" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-foreground">Inner Sanctum Control</h1>
          <Badge variant="outline" className="border-destructive text-destructive bg-destructive/10">
            Admin Access
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card className="bg-card border-border shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                <h3 className="text-3xl font-bold">{isStatsLoading ? <Skeleton className="h-9 w-16" /> : stats?.totalUsers}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Submitted Qs</p>
                <h3 className="text-3xl font-bold">{isStatsLoading ? <Skeleton className="h-9 w-16" /> : stats?.submittedQuestionnaires}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <FileText className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Paid Reports</p>
                <h3 className="text-3xl font-bold">{isStatsLoading ? <Skeleton className="h-9 w-16" /> : stats?.paidUsers}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                <CreditCard className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">New Users (30d)</p>
                <h3 className="text-3xl font-bold">{isStatsLoading ? <Skeleton className="h-9 w-16" /> : stats?.recentUsers}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Activity className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="font-serif">Seekers Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {isUsersLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-background" />
                <Skeleton className="h-12 w-full bg-background" />
                <Skeleton className="h-12 w-full bg-background" />
              </div>
            ) : !users || users.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No users found.</div>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow 
                        key={u.id} 
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setLocation(`/admin/users/${u.clerkUserId}`)}
                      >
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>{u.name || <span className="text-muted-foreground italic">None</span>}</TableCell>
                        <TableCell>
                          {u.questionnaireStatus === "submitted" ? (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Submitted</Badge>
                          ) : u.questionnaireStatus === "draft" ? (
                            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">Draft</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground border-border">None</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {u.hasPaidReport ? (
                            <span className="text-green-500 font-medium">Yes</span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
