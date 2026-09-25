"use client";

import { 
  Button, 
  Card, 
  Skeleton,
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
} from "@onlystartups/ui";
import { Plus, Calendar, MapPin, Users, Loader2, Trash2, MoreVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getHubEvents, deleteEvent } from "@/actions/gov-department/events";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    const result = await getHubEvents();
    if (result?.error) {
      setError(result.error);
    } else {
      setEvents(result || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await deleteEvent(id);
      if (res && !res.error) {
        toast.success("Event deleted successfully");
        setEvents(events.filter(e => e.id !== id));
      } else {
        toast.error(res?.error || "Failed to delete event");
      }
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Briefings & Workshops Management</h1>
          <p className="text-sm text-gray-500">Create and manage upcoming briefings & workshops for your government department.</p>
        </div>
        <Link href="/gov-department/events/new">
          <Button className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Create New Briefing/Workshop
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No briefings or workshops yet</h3>
          <p className="text-gray-500 mb-6">Create your first briefing or workshop to start engaging with startups!</p>
          <Link href="/gov-department/events/new">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Briefing/Workshop
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Event Details</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Date & Time</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6">Registrations</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-[#1A1A2E]/70 py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const pendingCount = event.registrations?.filter((r: any) => r.status === 'PENDING').length || 0;
                  const approvedCount = event.registrations?.filter((r: any) => r.status === 'APPROVED').length || 0;

                  return (
                    <TableRow key={event.id} className="border-gray-50 hover:bg-gray-50/40 transition-colors">
                      <TableCell className="py-4 px-6 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                        <div className="flex items-center gap-3">
                          {event.image ? (
                            <div className="w-12 h-8 rounded bg-gray-100 overflow-hidden shrink-0 relative">
                              <Image src={event.image} alt={event.title} fill unoptimized className="object-cover w-full h-full" />
                            </div>
                          ) : (
                            <div className="w-12 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-[#1A1A2E] leading-tight break-words line-clamp-2">{event.title}</h4>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs text-gray-600 font-medium">
                        {format(new Date(event.date), 'MMM d, yyyy')} • {event.time || 'TBD'}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3 text-xs">
                          <div>
                            <span className="font-bold text-amber-600">{pendingCount}</span>
                            <span className="text-[10px] text-gray-400 ml-1">Pending</span>
                          </div>
                          <div className="w-px h-3 bg-gray-200"></div>
                          <div>
                            <span className="font-bold text-green-600">{approvedCount}</span>
                            <span className="text-[10px] text-gray-400 ml-1">Approved</span>
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
                          <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1">
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href={`/gov-department/events/${event.id}`} className="w-full flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>Manage</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
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
  );
}
