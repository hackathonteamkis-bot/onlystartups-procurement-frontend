"use client";

import { useState, useEffect } from "react";
import { getPrograms, deleteProgram, updateProgram } from "@/actions/gov-department/programs";
import { 
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Badge,
} from "@onlystartups/ui";
import { 
  Loader2, 
  Plus, 
  Calendar as CalendarIcon, 
  Users, 
  Settings2, 
  Trash2, 
  Rocket, 
  ArrowRight, 
  Play, 
  Square, 
  CircleDashed,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPrograms = async () => {
      try {
        const res = await getPrograms();
        if (res && !res.error) {
          setPrograms(res);
        }
      } catch (err) {
        toast.error("Failed to fetch programs");
      } finally {
        setLoading(false);
      }
    };
    fetchAllPrograms();
  }, []);

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      const res = await deleteProgram(id);
      if (res.success) {
        toast.success("Program deleted");
        setPrograms(programs.filter(c => c.id !== id));
      } else {
        toast.error(res.error || "Failed to delete program");
      }
    } catch (e) {
      toast.error("Failed to delete program");
    }
  };

  const handleToggleActive = async (program: any) => {
    const newStatus = program.status === 'ACTIVE' ? 'INTAKE' : 'ACTIVE';
    try {
      const res = await updateProgram(program.id, { status: newStatus });
      if (res && !res.error) {
        toast.success(newStatus === 'ACTIVE' ? 'Applications are now Closed' : 'Applications are now Active');
        setPrograms(programs.map(c => c.id === program.id ? { ...c, status: newStatus } : c));
      } else {
        toast.error(res?.error || 'Failed to update status');
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 sm:p-6 pb-20 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#1A1A2E] to-[#2a2a4a] p-8 rounded-xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Rocket className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Program Management</h1>
          <p className="text-white/70 max-w-xl text-sm leading-relaxed">
            Create, deploy, and manage your incubator and accelerator batches. Track applications, select founders, and monitor program progress.
          </p>
        </div>
        <div className="shrink-0 relative z-10">
          <Link href="/gov-department/programs/new">
            <Button className="bg-[#F26522] hover:bg-[#E55512] text-white rounded-xl px-6 py-6 shadow-lg shadow-[#F26522]/30 transition-all hover:scale-105 active:scale-95 group">
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Deploy New Program
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1A1A2E]" /></div>
          ) : programs.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                <Rocket className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-bold text-gray-600">No programs created yet.</p>
              <p className="text-sm text-gray-400 mt-1">Deploy your first batch to start organizing startups!</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-gray-100">
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Program Name</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Status</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Dates</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Engagement</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((program) => {
                      let statusText = "Draft";
                      let statusBg = "bg-orange-50 text-orange-600 border-orange-100";
                      if (program.status === 'INTAKE') {
                        statusText = "Live Intake";
                        statusBg = "bg-emerald-50 text-emerald-600 border-emerald-100";
                      } else if (program.status === 'ACTIVE') {
                        statusText = "Active (Closed)";
                        statusBg = "bg-blue-50 text-blue-600 border-blue-100";
                      }

                      return (
                        <TableRow key={program.id} className="border-gray-50 hover:bg-gray-50/40 transition-colors">
                          <TableCell className="py-4 px-6 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                            <div className="space-y-1">
                              <h4 className="font-bold text-sm text-[#1A1A2E] break-words line-clamp-2">
                                {program.name}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-1">{program.description || "No description provided."}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <Badge className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-transparent", statusBg)}>
                              {statusText}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-xs text-gray-600 font-medium">
                            {program.startDate ? format(new Date(program.startDate), "MMM d") : "TBD"} 
                            {program.endDate && ` - ${format(new Date(program.endDate), "MMM d, yyyy")}`}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-3 text-xs">
                              <div>
                                <span className="font-black text-[#1A1A2E]">{program._count.applications}</span>
                                <span className="text-[10px] text-gray-400 ml-1">Apps</span>
                              </div>
                              <div className="w-px h-3 bg-gray-200"></div>
                              <div>
                                <span className="font-black text-[#F26522]">{program._count.users}</span>
                                <span className="text-[10px] text-gray-400 ml-1">Selected</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1A1A2E]/50 hover:text-[#1A1A2E]">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1">
                                {program.status !== 'DRAFT' && (
                                  <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href={`/gov-department/programs/${program.id}`} className="w-full flex items-center gap-2">
                                      <ArrowRight className="w-4 h-4 text-gray-400" />
                                      <span>Manage Program</span>
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {program.status === 'DRAFT' ? (
                                  <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href={`/gov-department/programs/new?id=${program.id}`} className="w-full flex items-center gap-2">
                                      <Settings2 className="w-4 h-4 text-gray-400" />
                                      <span>Continue Setup</span>
                                    </Link>
                                  </DropdownMenuItem>
                                ) : (
                                  <>
                                    {program.status === 'INTAKE' && (
                                      <DropdownMenuItem asChild className="cursor-pointer">
                                        <Link href={`/gov-department/programs/new?id=${program.id}`} className="w-full flex items-center gap-2">
                                          <Settings2 className="w-4 h-4 text-gray-400" />
                                          <span>Edit Form</span>
                                        </Link>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem 
                                      className="cursor-pointer flex items-center gap-2"
                                      onClick={() => handleToggleActive(program)}
                                    >
                                      {program.status === 'ACTIVE' ? <Play className="w-4 h-4 text-gray-400" /> : <Square className="w-4 h-4 text-gray-400" />}
                                      <span>{program.status === 'ACTIVE' ? 'Reopen Apps' : 'Close Apps'}</span>
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem 
                                  className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                                  onClick={() => handleDeleteProgram(program.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete Program</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
