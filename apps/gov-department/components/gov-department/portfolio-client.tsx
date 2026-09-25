"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  Search,
  Activity,
  Plus,
  Trash2,
  MoreVertical,
  FileText
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Progress } from "@onlystartups/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@onlystartups/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@onlystartups/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { getGovDepartmentData, addStartup, removeStartup } from "@/actions/gov-department";

export function PortfolioClient({ initialData }: { initialData: any }) {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(initialData);
  const [search, setSearch] = useState("");
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStartup, setNewStartup] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await getGovDepartmentData();
    if (res && !("error" in res)) {
      setData(res);
    }
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    if (!session?.user?.id || session.user.role !== "GOV_DEPARTMENT") return;

    const userId = session.user.id;

    const usersChannel = supabase
      .channel(`portfolio-users-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `govDepartment_id=eq.${userId}`,
        },
        () => {
          void fetchData();
        },
      )
      .subscribe();

    const milestonesChannel = supabase
      .channel(`portfolio-milestones-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "milestones",
        },
        () => {
          void fetchData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(milestonesChannel);
    };
  }, [session?.user?.id, session?.user?.role, fetchData]);

  const filteredStartups = useMemo(() => {
      return data?.startups?.filter((s: any) =>
        (s.startupName || s.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
  }, [data?.startups, search]);

  const stats = useMemo(() => {
      return {
        total: data?.startups?.length || 0,
        onTrack: data?.startups?.length || 0, // Since we removed "at risk", all are considered active/tracked
      };
  }, [data?.startups]);

  const handleAddStartup = async () => {
    setIsSubmitting(true);
    try {
      await addStartup(newStartup);
      setIsAddOpen(false);
      setNewStartup({ name: "", email: "" });
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (confirm("Are you sure you want to remove this startup?")) {
      try {
        await removeStartup(id);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Active Pilots"
        description="Manage your startups."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#1A1A2E] text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Users className="w-20 h-20" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Users className="w-6 h-6 text-[#F26522]" />
              </div>
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                  Total Managed
                </p>
                <p className="text-3xl font-black">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[#1A1A2E]/40 text-xs font-bold uppercase tracking-widest">
                  Active Startups
                </p>
                <p className="text-3xl font-black text-[#1A1A2E]">
                  {stats.onTrack}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full">
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Startups</CardTitle>
                <CardDescription>
                  Detailed engagement metrics and management per team
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A2E]/30" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-10 w-[180px] bg-white border-none"
                  />
                </div>
                
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#F26522] hover:bg-[#F26522]/90 text-white gap-2 h-10 px-4">
                      <Plus className="w-4 h-4" /> Add Startup
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add a Startup</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Startup / Founder Name</Label>
                        <Input 
                          placeholder="Acme Corp" 
                          value={newStartup.name} 
                          onChange={e => setNewStartup({...newStartup, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Founder Email</Label>
                        <Input 
                          placeholder="founder@acme.com" 
                          type="email" 
                          value={newStartup.email} 
                          onChange={e => setNewStartup({...newStartup, email: e.target.value})} 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddStartup} disabled={isSubmitting || !newStartup.email || !newStartup.name}>
                        {isSubmitting ? "Adding..." : "Add Startup"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-[#1A1A2E]/5">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Startup</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest">Email</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStartups?.map((startup: any) => {
                  return (
                    <TableRow key={startup.id} className="border-[#1A1A2E]/5 group transition-colors hover:bg-[#F26522]/5">
                      <TableCell className="font-bold text-sm">
                        <Link href={`/gov-department/portfolio/${startup.id}`} className="hover:text-[#F26522] hover:underline transition-colors">
                          {startup.startupName || startup.name || "Unnamed"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-[#1A1A2E]/70">
                        {startup.email}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1A1A2E]/50 hover:text-[#1A1A2E]">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {startup.applications?.[0]?.id ? (
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/gov-department/programs`} className="flex items-center gap-2 w-full">
                                  <FileText className="h-4 w-4" />
                                  Application
                                </Link>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem disabled className="gap-2 cursor-not-allowed opacity-50">
                                <FileText className="h-4 w-4" />
                                No Application
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="gap-2 cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50" 
                              onClick={() => handleRemove(startup.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredStartups?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-[#1A1A2E]/40">
                      No startups found. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
