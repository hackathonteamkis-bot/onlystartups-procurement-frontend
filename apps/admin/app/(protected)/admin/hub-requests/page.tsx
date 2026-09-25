"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@onlystartups/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@onlystartups/ui";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { getPendingHubRequests, approveHubRequest, rejectHubRequest, blockHubRequest } from "@/actions/admin/hub-requests";

interface HubRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  startupHubName: string;
  details: string | null;
  status: string;
  createdAt: Date;
}

export default function HubRequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<HubRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HubRequest | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ email: string; tempPassword: string } | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      toast.error("Access denied. Admin only.");
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const fetchData = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      setLoading(true);
      const res = await getPendingHubRequests(session.accessToken);
      if (res.success) {
        setRequests(res.data);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      console.error("Failed to fetch hub requests:", error);
      toast.error("Failed to load hub requests");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchData();
    }
  }, [fetchData, status, session]);

  const handleApprove = async () => {
    if (!selectedRequest || !session?.accessToken) return;
    
    try {
      const res = await approveHubRequest(selectedRequest.id, session.accessToken);
      if (res.success) {
        toast.success(`Approved request for ${selectedRequest.startupHubName}`);
        setGeneratedCredentials({
          email: selectedRequest.email,
          tempPassword: res.data.tempPassword,
        });
        fetchData();
      } else {
        toast.error(res.error);
        setApproveDialogOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred during approval");
      setApproveDialogOpen(false);
    }
  };

  const handleReject = async (req: HubRequest) => {
    if (!session?.accessToken) return;
    try {
      const res = await rejectHubRequest(req.id, session.accessToken);
      if (res.success) {
        toast.success(`Rejected request for ${req.startupHubName}`);
        fetchData();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred during rejection");
    }
  };

  const handleBlock = async (req: HubRequest) => {
    if (!session?.accessToken) return;
    try {
      const res = await blockHubRequest(req.id, session.accessToken);
      if (res.success) {
        toast.success(`Blocked request for ${req.startupHubName}`);
        fetchData();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred during blocking");
    }
  };

  const copyToClipboard = () => {
    if (!generatedCredentials) return;
    const text = `Email: ${generatedCredentials.email}\nPassword: ${generatedCredentials.tempPassword}`;
    navigator.clipboard.writeText(text);
    toast.success("Credentials copied to clipboard");
  };

  if (session?.user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Startup Hub Requests"
        description="Review and approve incoming requests from startup hubs to join the platform."
      >
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </PageHeader>

      <div className="rounded-lg border border-[#1A1A2E]/10 overflow-hidden bg-white/60">
        <Table>
              <TableHeader>
                <TableRow className="bg-[#1A1A2E]/5">
                  <TableHead>Hub Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-[#1A1A2E]/5">
                    <TableCell className="font-medium">{req.startupHubName}</TableCell>
                    <TableCell>{req.name}</TableCell>
                    <TableCell>{req.email}</TableCell>
                    <TableCell>
                      {req.status === 'PENDING' ? (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </Badge>
                      ) : req.status === 'APPROVED' ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" /> Approved
                        </Badge>
                      ) : (
                        <Badge variant="outline">{req.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-[#1A1A2E]/60">
                      {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      {req.status === 'PENDING' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-[#F26522] hover:bg-[#F26522]/90"
                            >
                              Review
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRequest(req);
                                setApproveDialogOpen(true);
                                setGeneratedCredentials(null);
                              }}
                              className="text-green-600 focus:text-green-700 cursor-pointer"
                            >
                              Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReject(req)}
                              className="text-red-600 focus:text-red-700 cursor-pointer"
                            >
                              Reject/Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleBlock(req)}
                              className="text-gray-600 focus:text-gray-700 cursor-pointer"
                            >
                              Block
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {requests.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-[#1A1A2E]/40">
                      No requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
      </div>

      <Dialog open={approveDialogOpen} onOpenChange={(open) => {
        setApproveDialogOpen(open);
        if (!open) setGeneratedCredentials(null);
      }}>
        <DialogContent>
          {!generatedCredentials ? (
            <>
              <DialogHeader>
                <DialogTitle>Approve Startup Hub</DialogTitle>
                <DialogDescription>
                  Review the application for {selectedRequest?.startupHubName}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A2E]/60 mb-1">Contact Name</h4>
                  <p className="text-sm font-medium">{selectedRequest?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A2E]/60 mb-1">Email</h4>
                  <p className="text-sm font-medium">{selectedRequest?.email}</p>
                </div>
                {selectedRequest?.phone && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A2E]/60 mb-1">Phone</h4>
                    <p className="text-sm font-medium">{selectedRequest?.phone}</p>
                  </div>
                )}
                {selectedRequest?.details && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A2E]/60 mb-1">Additional Details</h4>
                    <p className="text-sm bg-[#1A1A2E]/5 p-3 rounded-md mt-1">{selectedRequest.details}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-[#1A1A2E]/10">
                  <p className="text-sm text-[#1A1A2E]/80">
                    Approving this request will automatically generate a new user account with the <b>STARTUP_HUB</b> role. You will be provided with a secure temporary password to share with them securely.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  className="bg-[#F26522] hover:bg-[#F26522]/90"
                >
                  Approve & Generate Account
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" /> Account Generated
                </DialogTitle>
                <DialogDescription>
                  The account has been created successfully. Please securely share these credentials with the startup hub.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-4">
                <div className="bg-[#1A1A2E]/5 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-[#1A1A2E]/60">Login URL</span>
                    <p className="font-mono text-sm mt-1">https://startuphub.onlystartups.com</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1A1A2E]/60">Email</span>
                    <p className="font-mono text-sm mt-1">{generatedCredentials.email}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1A1A2E]/60">Temporary Password</span>
                    <p className="font-mono text-sm mt-1 text-green-700 bg-green-100 p-2 rounded inline-block">{generatedCredentials.tempPassword}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={copyToClipboard}>
                  Copy Credentials
                </Button>
                <Button onClick={() => setApproveDialogOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
