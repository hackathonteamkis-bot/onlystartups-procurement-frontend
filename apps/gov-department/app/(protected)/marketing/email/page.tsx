"use client";

import { useState } from "react";
import {
  Mail,
  Plus,
  Send,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
  Eye,
  MousePointer,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@onlystartups/ui";
import { toast } from "sonner";

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  segment: string;
  status: "ACTIVE" | "SCHEDULED" | "COMPLETED" | "DRAFT";
  sentCount: number;
  openRate: string;
  clickRate: string;
  scheduledAt: string;
}

const INITIAL_EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: "e1",
    name: "Summer Program 2026 Application Drip",
    subject: "Applications for Summer Program 2026 are now open!",
    segment: "Pre-Seed & Seed Founders",
    status: "ACTIVE",
    sentCount: 1420,
    openRate: "68.4%",
    clickRate: "24.1%",
    scheduledAt: "Sent 2 hours ago"
  },
  {
    id: "e2",
    name: "Funding Opportunity Announcement",
    subject: "New ₹50k Funding Opportunity Available for AI Startups",
    segment: "All Registered Founders",
    status: "SCHEDULED",
    sentCount: 3200,
    openRate: "--",
    clickRate: "--",
    scheduledAt: "Tomorrow at 9:00 AM"
  },
  {
    id: "e3",
    name: "Weekly Hub Newsletter #42",
    subject: "Top 5 Pitch Mistakes to Avoid & Investor Speed Dating",
    segment: "All Registered Founders",
    status: "COMPLETED",
    sentCount: 2850,
    openRate: "62.1%",
    clickRate: "19.8%",
    scheduledAt: "July 15, 2026"
  },
  {
    id: "e4",
    name: "Pending Application Nudge",
    subject: "Finish your program application before midnight!",
    segment: "Pending Applicants",
    status: "ACTIVE",
    sentCount: 640,
    openRate: "71.5%",
    clickRate: "32.0%",
    scheduledAt: "Sent 1 day ago"
  }
];

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(INITIAL_EMAIL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    segment: "All Registered Founders",
    content: ""
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      toast.error("Please complete all required fields.");
      return;
    }

    const created: EmailCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      segment: newCampaign.segment,
      status: "ACTIVE",
      sentCount: 2450,
      openRate: "Pending",
      clickRate: "Pending",
      scheduledAt: "Just now"
    };

    setCampaigns([created, ...campaigns]);
    toast.success(`Email campaign "${newCampaign.name}" launched successfully!`);
    setIsModalOpen(false);
    setNewCampaign({ name: "", subject: "", segment: "All Registered Founders", content: "" });
  };

  const filtered = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.segment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-1 sm:px-2 py-4 space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1A1A2E]/5 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-blue-600" />
            Email Campaigns
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#1A1A2E]/60 mt-1">
            Build, automate, and track high-converting email sequences for founders and applicants.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl px-5 h-11 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Email Campaign
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sent</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">18,450</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">99.6% Delivery Rate</p>
            </div>
            <div className="bg-blue-500/10 p-2.5 rounded-xl">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Open Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">68.4%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">+14% vs benchmark</p>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">24.1%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">High engagement</p>
            </div>
            <div className="bg-purple-500/10 p-2.5 rounded-xl">
              <MousePointer className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unsubscribe Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">0.12%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Ultra healthy list</p>
            </div>
            <div className="bg-amber-500/10 p-2.5 rounded-xl">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search email campaigns or subject lines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-white/60 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-3">
        {filtered.map((campaign) => (
          <Card key={campaign.id} className="border-none shadow-sm bg-white/70 hover:bg-white transition-all rounded-2xl">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-[#1A1A2E] text-base">{campaign.name}</p>
                    <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-none ${
                      campaign.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-600"
                        : campaign.status === "SCHEDULED"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1">&quot;{campaign.subject}&quot;</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    Segment: <strong className="text-slate-700">{campaign.segment}</strong> • {campaign.scheduledAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-center shrink-0 text-right">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Recipients</p>
                  <p className="text-sm font-black text-slate-800">{campaign.sentCount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Open Rate</p>
                  <p className="text-sm font-black text-slate-800">{campaign.openRate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Click Rate</p>
                  <p className="text-sm font-black text-slate-800">{campaign.clickRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[540px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Create Email Campaign
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Draft and schedule a broadcast or drip email to your founder directory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Internal Campaign Name</Label>
              <Input
                placeholder="e.g. Q3 Investor Office Hours Invite"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Target Segment</Label>
              <Select
                value={newCampaign.segment}
                onValueChange={(val) => setNewCampaign({ ...newCampaign, segment: val })}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Registered Founders">All Registered Founders</SelectItem>
                  <SelectItem value="Active Program Startups">Active Program Startups</SelectItem>
                  <SelectItem value="Pending Applicants">Pending Applicants</SelectItem>
                  <SelectItem value="Mentors & Investors">Mentors & Investors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Subject Line</Label>
              <Input
                placeholder="e.g. Exclusive Investor Office Hours Registration Open"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Email Body</Label>
              <Textarea
                placeholder="Write your email content here..."
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                required
                className="min-h-[120px] text-xs rounded-xl resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs h-9 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 rounded-xl px-5">
                Send Broadcast
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
