"use client";

import { useEffect, useState, use, useCallback } from "react";
import { getEventById, updateEventRegistrationStatus, deleteEvent } from "@/actions/startup-hub/events";
import { Button, Card, Skeleton, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@onlystartups/ui";
import { Calendar, MapPin, Users, ArrowLeft, Loader2, Search, CheckCircle, XCircle, Trash2, Settings2, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EventManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    const result = await getEventById(eventId);
    if (result?.error) {
      setError(result.error);
    } else {
      setEvent(result);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const handleUpdateStatus = async (regId: string, status: string) => {
    setActionLoading(regId);
    try {
      const res = await updateEventRegistrationStatus(regId, status);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Applicant ${status.toLowerCase()} successfully`);
        loadEvent(); // Reload to get fresh data
      }
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    try {
      const res = await deleteEvent(eventId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Event deleted successfully");
        router.push("/startup-hub/events");
      }
    } catch (e) {
      toast.error("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <Card className="p-8">
          <Skeleton className="h-32 w-full mb-8 rounded-xl" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-red-100">
        <h3 className="text-lg font-medium text-red-900 mb-1">Error Loading Event</h3>
        <p className="text-red-500 mb-6">{error || "Event not found"}</p>
        <Link href="/startup-hub/events">
          <Button variant="outline">Back to Events</Button>
        </Link>
      </div>
    );
  }

  const registrations = event.registrations || [];
  const filteredRegistrations = registrations.filter((reg: any) => 
    reg.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.user?.startupName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link href="/startup-hub/events" className="text-xs font-black text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors tracking-widest uppercase mb-4 w-fit">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Events
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{event.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href={`/startup-hub/events/new?id=${eventId}`}>
            <Button variant="outline" className="shrink-0 shadow-sm text-gray-700 bg-white border-gray-200 hover:bg-gray-50">
              <Settings2 className="w-4 h-4 mr-2" /> Edit Event
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDeleteEvent} className="shrink-0 shadow-sm">
            <Trash2 className="w-4 h-4 mr-2" /> Delete Event
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{format(new Date(event.date), 'MMMM d, yyyy')} {event.time && `at ${event.time}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{registrations.length} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} Attendees</span>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Applicant Management</h2>
            <p className="text-sm text-gray-500">Review and approve startups for this event.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search applicants..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#1A1A2E]/20 focus:border-[#1A1A2E] transition-all"
            />
          </div>
        </div>

        {filteredRegistrations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No applicants found.</p>
            {searchQuery && <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria.</p>}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((reg: any) => (
                  <TableRow key={reg.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                          {reg.user?.image ? (
                            <Image src={reg.user.image} alt={`${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim()} fill unoptimized className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg">
                              {reg.user?.name?.[0] || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{reg.user?.name}</div>
                          {reg.user?.startupName && (
                            <div className="text-xs text-gray-500">
                              {reg.user.startupName} {reg.user.startupPhase && `• ${reg.user.startupPhase}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reg.status === 'APPROVED' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>}
                      {reg.status === 'REJECTED' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>}
                      {reg.status === 'PENDING' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>}
                      {reg.status === 'WAITLISTED' && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Waitlisted</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {format(new Date(reg.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {reg.status !== 'APPROVED' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateStatus(reg.id, 'APPROVED')}
                            disabled={actionLoading === reg.id}
                            className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 shadow-none"
                          >
                            {actionLoading === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-1.5" /> Approve</>}
                          </Button>
                        )}
                        {reg.status !== 'WAITLISTED' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateStatus(reg.id, 'WAITLISTED')}
                            disabled={actionLoading === reg.id}
                            className="bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 shadow-none"
                          >
                            {actionLoading === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Clock className="w-4 h-4 mr-1.5" /> Waitlist</>}
                          </Button>
                        )}
                        {reg.status !== 'REJECTED' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateStatus(reg.id, 'REJECTED')}
                            disabled={actionLoading === reg.id}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-none"
                          >
                            {actionLoading === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4 mr-1.5" /> Reject</>}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
