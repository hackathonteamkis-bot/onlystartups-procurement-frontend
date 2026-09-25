"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProgramById } from "@/actions/startup-hub/programs";
import { getStartupHubProgramApplications, updateApplicationStatus } from "@/actions/explore/apply";
import { Loader2, ArrowLeft, Users, CheckCircle2, XCircle, Clock, Search, Filter, Sparkles, MoveRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage, Badge, Tabs, TabsContent, TabsList, TabsTrigger, Input } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function ApplicationCard({ app, program, onStatusUpdate }: { app: any, program: any, onStatusUpdate?: (id: string, status: "APPROVED" | "REJECTED") => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={cn(
        "group bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#F26522]/30 transition-all shadow-sm hover:shadow-xl relative overflow-hidden",
        app.status === "APPROVED" ? "bg-emerald-50/10" : app.status === "REJECTED" ? "bg-red-50/10 opacity-75 grayscale-[50%]" : ""
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-gray-50 shadow-sm">
            <AvatarImage src={app.user.image || ""} />
            <AvatarFallback className="bg-[#1A1A2E] text-white text-lg font-black">{`${app.user.firstName || ''} ${app.user.lastName || ''}`.trim()?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/startup-hub/programs/${program.id}/applications/${app.id}`} className="font-black text-base text-gray-900 group-hover:text-[#F26522] transition-colors line-clamp-1">
              {app.user.startupName || `${app.user.firstName || ''} ${app.user.lastName || ''}`.trim()}
            </Link>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">{app.user.email}</p>
          </div>
        </div>
        <Link href={`/startup-hub/programs/${program.id}/applications/${app.id}`} className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E] bg-gray-50 px-3 py-1.5 rounded-full hover:bg-[#F26522] hover:text-white transition-colors flex items-center gap-1">
          View <MoveRight className="w-3 h-3" />
        </Link>
      </div>

      {app.status === "PENDING" && onStatusUpdate && (
        <div className="mt-5 pt-4 border-t border-gray-50 flex gap-3">
          <button onClick={(e) => { e.preventDefault(); onStatusUpdate(app.id, "APPROVED"); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            <CheckCircle2 className="w-4 h-4" /> Accept
          </button>
          <button onClick={(e) => { e.preventDefault(); onStatusUpdate(app.id, "REJECTED"); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-700 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function ProgramCommandCenter() {
  const params = useParams();
  const programId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [program, setProgram] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!programId) return;
      try {
        const [programRes, appsRes] = await Promise.all([
          getProgramById(programId),
          getStartupHubProgramApplications(programId)
        ]);
        
        if (programRes && !programRes.error) {
          setProgram(programRes);
        }
        if (appsRes) {
          if (Array.isArray(appsRes)) {
            setApplications(appsRes);
          } else if (appsRes.applications) {
            setApplications(appsRes.applications);
          } else {
             setApplications([]);
          }
        }
      } catch (e) {
        toast.error("Failed to load manage program data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [programId]);

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await updateApplicationStatus(id, status);
      if (res.success) {
        toast.success(res.success);
        setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-[#1A1A2E]" /></div>;
  }

  if (!program) {
    return <div className="p-12 text-center font-bold text-gray-500">Program not found.</div>;
  }

  const filteredApps = applications.filter(app => 
    (app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     app.user?.startupName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingApps = filteredApps.filter(a => a.status === "PENDING");
  const approvedApps = filteredApps.filter(a => a.status === "APPROVED");
  const rejectedApps = filteredApps.filter(a => a.status === "REJECTED");

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 p-4 sm:p-6 animate-in fade-in duration-500">
      <Link href="/startup-hub/programs" className="text-xs font-black text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors tracking-widest uppercase w-fit bg-gray-50 px-4 py-2 rounded-full">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Programs
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight">{program.name}</h1>
            <Badge className={cn("uppercase tracking-widest text-[10px] font-black px-3 py-1", program.status === 'INTAKE' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-[#1A1A2E]')}>
              {program.status === 'INTAKE' ? 'Live Intake' : program.status}
            </Badge>
          </div>
          <p className="text-gray-500 text-sm font-medium">Manage Program - Manage applications and program settings.</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 group-hover:text-blue-50 transition-colors"><Users className="w-32 h-32" /></div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center relative z-10">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-4xl font-black text-[#1A1A2E]">{applications.length}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Total Submissions</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 group-hover:text-emerald-50 transition-colors"><CheckCircle2 className="w-32 h-32" /></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center relative z-10">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-4xl font-black text-[#1A1A2E]">{applications.filter(a => a.status === "APPROVED").length}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Founders Accepted</p>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-gray-50 opacity-50 group-hover:text-orange-50 transition-colors"><Clock className="w-32 h-32" /></div>
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center relative z-10">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-4xl font-black text-[#1A1A2E]">{applications.filter(a => a.status === "PENDING").length}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Pending Review</p>
          </div>
        </div>
      </div>

      {/* Funnel Status Board (Tabs) */}
      <div className="mt-12 bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-xl shadow-[#1A1A2E]/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
           <h2 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
             <Filter className="w-5 h-5 text-[#F26522]" /> Funnel Status Board
           </h2>
           <div className="relative w-full sm:w-72 shrink-0">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <Input 
               placeholder="Search founders or startups..." 
               className="pl-9 bg-gray-50/50 border-gray-200 rounded-xl h-11 focus-visible:ring-[#F26522]/20"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
        </div>
        
        <Tabs defaultValue="under-review" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 h-14 bg-gray-50/50 p-1.5 rounded-2xl">
            <TabsTrigger value="under-review" className="rounded-xl flex items-center justify-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#1A1A2E] data-[state=active]:shadow-sm text-gray-500 font-bold text-xs sm:text-sm transition-all">
              <Clock className="w-4 h-4 hidden sm:block" /> Reviewing
              <Badge variant="secondary" className="ml-1 sm:ml-2 bg-gray-100 text-gray-600">{pendingApps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="rounded-xl flex items-center justify-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-500 font-bold text-xs sm:text-sm transition-all">
              <CheckCircle2 className="w-4 h-4 hidden sm:block" /> Accepted
              <Badge variant="secondary" className="ml-1 sm:ml-2 bg-white/20 text-current">{approvedApps.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-xl flex items-center justify-center gap-2 data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-500 font-bold text-xs sm:text-sm transition-all">
              <XCircle className="w-4 h-4 hidden sm:block" /> Rejected
              <Badge variant="secondary" className="ml-1 sm:ml-2 bg-white/20 text-current">{rejectedApps.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <div className="bg-gray-50/30 rounded-2xl border border-dashed border-gray-200 p-4 sm:p-6 min-h-[400px]">
            <TabsContent value="under-review" className="m-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {pendingApps.map(app => (
                    <ApplicationCard key={app.id} app={app} program={program} onStatusUpdate={handleStatusUpdate} />
                  ))}
                </AnimatePresence>
              </div>
              {pendingApps.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><Clock className="w-8 h-8 opacity-50" /></div>
                  <p className="font-semibold text-sm">Inbox Zero! No pending applications to review.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="accepted" className="m-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {approvedApps.map(app => (
                    <ApplicationCard key={app.id} app={app} program={program} />
                  ))}
                </AnimatePresence>
              </div>
              {approvedApps.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 space-y-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-8 h-8 opacity-50" /></div>
                   <p className="font-semibold text-sm">No founders accepted yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="m-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {rejectedApps.map(app => (
                    <ApplicationCard key={app.id} app={app} program={program} />
                  ))}
                </AnimatePresence>
              </div>
              {rejectedApps.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 space-y-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><XCircle className="w-8 h-8 opacity-50" /></div>
                   <p className="font-semibold text-sm">No rejected applications.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
