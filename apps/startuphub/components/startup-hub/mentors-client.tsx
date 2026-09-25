"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { addMentor } from "@/actions/mentors";
import { 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@onlystartups/ui";
import { Users2, Plus, Mail, Star, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function MentorsClient({ initialData = [] }: { initialData?: any[] }) {
  const [mentors, setMentors] = useState<any[]>(initialData);
  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAddMentor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const expertiseStr = formData.get("expertise") as string;
    const expertise = expertiseStr.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const result = await addMentor({ name, email, expertise });
      if (result.error) throw new Error(result.error);
      
      toast.success("Mentor added successfully!");
      
      setOpen(false);
      // Refresh list
      router.refresh();
      // Optimistic update
      setMentors([{ ...result, user: { name, email, image: null } }, ...mentors]);
    } catch (error: any) {
      toast.error(error.message || "Failed to add mentor");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Mentors"
          description="Manage your mentor network and sessions."
        />
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Mentor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Mentor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMentor} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
                <p className="text-xs text-muted-foreground">They will receive an email to set up their account.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise (comma separated)</Label>
                <Input id="expertise" name="expertise" required placeholder="Fundraising, Tech, Growth" />
              </div>
              <Button type="submit" className="w-full bg-[#F26522] hover:bg-[#F26522]/90 text-white" disabled={isAdding}>
                {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Send Invite
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {mentors.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-64">
              <div className="p-4 bg-emerald-50 rounded-full mb-4">
                <Users2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">No mentors yet</h2>
              <p className="text-[#1A1A2E]/60 max-w-md mx-auto mb-6">
                Build your network by adding industry experts to mentor your startups.
              </p>
              <Button onClick={() => setOpen(true)} className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white rounded-xl">
                Add Your First Mentor
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6">Mentor</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentors.map((mentor) => (
                  <TableRow key={mentor.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={mentor.user.image} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {`${(mentor.user as any).firstName || ''} ${(mentor.user as any).lastName || ''}`.trim()?.charAt(0) || "M"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#1A1A2E]">{`${(mentor.user as any).firstName || ''} ${(mentor.user as any).lastName || ''}`.trim()}</p>
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Mail className="w-3 h-3" />
                            {mentor.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise?.map((exp: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-[#F26522]/10 text-[#F26522] hover:bg-[#F26522]/20 text-xs font-medium border-none">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        {mentor.sessions?.length || 0} sessions
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="outline" size="sm" asChild className="rounded-full font-medium">
                        <Link href={`/startup-hub/mentors/${mentor.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
