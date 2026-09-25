"use client";


import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Activity,
  FileText,
  UsersRound,
  TrendingUp,
  Crown,
  Search,
  MoreVertical,
  Trash2,
  UserCog,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Skeleton } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@onlystartups/ui";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@onlystartups/ui";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "@/actions/admin/admin";
import { UserRole } from "@/schemas";
import { PageHeader } from "@/components/shared/page-header";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  image: string | null;
  emailVerified: Date | null;
  onboardingComplete: boolean;
  startupName: string | null;
  startupPhase: string | null;
  createdAt: Date;
  _count: {
    activities: number;
  };
}

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  onboardedUsers: number;
  totalActivities: number;
  usersByRole: Record<string, number>;
  recentUsers: {
    id: string;
    firstName: string | null;
  lastName: string | null;
    email: string;
    image: string | null;
    role: string;
    createdAt: Date;
  }[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  // Check admin access
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      toast.error("Access denied. Admin only.");
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData as User[]);
      setFilteredUsers(usersData as User[]);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchData();
    }
  }, [fetchData, status, session]);

  // Filter users
  useEffect(() => {
    let result = users;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          `${user.firstName || ''} ${user.lastName || ''}`.trim()?.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.startupName?.toLowerCase().includes(query),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

  // Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await updateUserRole(selectedUser.id, newRole as UserRole);
      toast.success(`Updated ${`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()}'s role to ${newRole}`);
      setRoleDialogOpen(false);
      setSelectedUser(null);
      setNewRole("");
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update role";
      toast.error(message);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast.success(`Deleted user: ${`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.email}`);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete user";
      toast.error(message);
    }
  };

  // Role badge color
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "GOV_DEPARTMENT":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-48 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="border-none shadow-sm bg-white/60 h-[104px] overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="border-none shadow-sm bg-white/60 h-[400px]"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-48 pt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="flex flex-row items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <div className="space-y-2 flex flex-col items-end">
                        <Skeleton className="h-5 w-16 rounded-md" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Access denied
  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <PageHeader
        title="Admin Dashboard"
        description="Manage users, monitor activity, and oversee the platform."
      >
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#1A1A2E]/5 bg-gradient-to-br from-white to-purple-50/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full -mr-10 -mt-10" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1A2E]/60">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-[#1A1A2E]">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-green-600 font-medium">
                {stats?.verifiedUsers || 0} verified
              </span>
              <span className="text-[#1A1A2E]/40">•</span>
              <span className="text-[#1A1A2E]/60">
                {stats?.onboardedUsers || 0} onboarded
              </span>
            </div>
          </CardContent>
        </Card>


        <Card className="border-[#1A1A2E]/5 bg-gradient-to-br from-white to-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1A2E]/60">
                  Activities
                </p>
                <p className="text-3xl font-bold text-[#1A1A2E]">
                  {stats?.totalActivities || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution & Recent Users */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#1A1A2E]/5 bg-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#F26522]" />
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.usersByRole || {}).map(([role, count]) => (
                <div
                  key={role}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#1A1A2E]/5"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadgeClass(role)}>{role}</Badge>
                  </div>
                  <span className="text-lg font-bold text-[#1A1A2E]">
                    {count}
                  </span>
                </div>
              ))}
              {Object.keys(stats?.usersByRole || {}).length === 0 && (
                <p className="text-center text-[#1A1A2E]/40 py-8">
                  No users yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1A1A2E]/5 bg-white/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F26522]" />
              Recent Users
            </CardTitle>
            <CardDescription>Newly registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentUsers?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1A1A2E]/5 transition-colors"
                >
                  <Avatar className="h-10 w-10 border-2 border-[#1A1A2E]/10">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-[#F26522] text-white text-sm font-bold">
                      {`${user.firstName || ''} ${user.lastName || ''}`.trim()?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A2E] truncate">
                      {`${user.firstName || ''} ${user.lastName || ''}`.trim() || "Anonymous"}
                    </p>
                    <p className="text-xs text-[#1A1A2E]/50 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={getRoleBadgeClass(user.role)}
                      variant="outline"
                    >
                      {user.role}
                    </Badge>
                    <p className="text-[10px] text-[#1A1A2E]/40 mt-1">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {!stats?.recentUsers?.length && (
                <p className="text-center text-[#1A1A2E]/40 py-8">
                  No users yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-[#1A1A2E]/5 bg-white/60">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A2E]/40" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="GOV_DEPARTMENT">Startup Hub</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-[#1A1A2E]/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1A1A2E]/5">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Startup</TableHead>
                  <TableHead className="text-center">Stats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[#1A1A2E]/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-[#F26522] text-white text-xs">
                            {`${user.firstName || ''} ${user.lastName || ''}`.trim()?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-[#1A1A2E]">
                            {`${user.firstName || ''} ${user.lastName || ''}`.trim() || "Anonymous"}
                          </p>
                          <p className="text-xs text-[#1A1A2E]/50">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getRoleBadgeClass(user.role)}
                        variant="outline"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          {user.emailVerified ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                          )}
                          <span className="text-xs">
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {user.onboardingComplete ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span className="text-xs">
                            {user.onboardingComplete ? "Onboarded" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A2E]">
                          {user.startupName || "-"}
                        </p>
                        {user.startupPhase && (
                          <p className="text-xs text-[#1A1A2E]/50">
                            {user.startupPhase}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-4 text-xs text-[#1A1A2E]/60">

                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role);
                              setRoleDialogOpen(true);
                            }}
                          >
                            <UserCog className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-[#1A1A2E]/40"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {`${selectedUser?.firstName || ''} ${selectedUser?.lastName || ''}`.trim() || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="GOV_DEPARTMENT">Startup Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRoleChange}
              className="bg-[#F26522] hover:bg-[#F26522]/90"
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              {`${selectedUser?.firstName || ''} ${selectedUser?.lastName || ''}`.trim() || selectedUser?.email}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
