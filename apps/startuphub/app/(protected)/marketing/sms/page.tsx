"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Users,
  Smartphone,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Zap,
  CreditCard
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

interface SmsCampaign {
  id: string;
  name: string;
  senderId: string;
  segment: string;
  status: "ACTIVE" | "SCHEDULED" | "COMPLETED" | "DRAFT";
  sentCount: number;
  deliveryRate: string;
  scheduledAt: string;
}

const INITIAL_SMS_CAMPAIGNS: SmsCampaign[] = [
  {
    id: "s1",
    name: "Demo Day Founder Flash Reminder",
    senderId: "ONLYST",
    segment: "Active Program Startups",
    status: "SCHEDULED",
    sentCount: 350,
    deliveryRate: "99.4%",
    scheduledAt: "Tomorrow at 10:00 AM"
  },
  {
    id: "s2",
    name: "Mentor Office Hours Quick Alert",
    senderId: "ONLYST",
    segment: "Pre-Seed Founders",
    status: "COMPLETED",
    sentCount: 890,
    deliveryRate: "98.8%",
    scheduledAt: "July 18, 2026"
  },
  {
    id: "s3",
    name: "Grant Application Midnight Deadline",
    senderId: "ONLYST",
    segment: "Pending Applicants",
    status: "ACTIVE",
    sentCount: 1250,
    deliveryRate: "99.1%",
    scheduledAt: "Sent 4 hours ago"
  }
];

export default function SmsCampaignsPage() {
  const [campaigns, setCampaigns] = useState<SmsCampaign[]>(INITIAL_SMS_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    senderId: "ONLYST",
    segment: "Active Program Startups",
    content: ""
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.content) {
      toast.error("Please fill in the campaign name and SMS text.");
      return;
    }

    const created: SmsCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      senderId: newCampaign.senderId,
      segment: newCampaign.segment,
      status: "ACTIVE",
      sentCount: 350,
      deliveryRate: "Pending",
      scheduledAt: "Just now"
    };

    setCampaigns([created, ...campaigns]);
    toast.success(`SMS broadcast "${newCampaign.name}" dispatched!`);
    setIsModalOpen(false);
    setNewCampaign({ name: "", senderId: "ONLYST", segment: "Active Program Startups", content: "" });
  };

  const filtered = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.segment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full px-1 sm:px-2 py-4 space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1A1A2E]/5 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            SMS Campaigns
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#1A1A2E]/60 mt-1">
            Send urgent notifications, event reminders, and time-sensitive alerts directly via SMS.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl px-5 h-11 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Send SMS Campaign
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SMS Credits</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">4,250</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Active Sender ID: ONLYST</p>
            </div>
            <div className="bg-purple-500/10 p-2.5 rounded-xl">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Open Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">95.8%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Under 3 minutes</p>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">99.2%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Carrier verified</p>
            </div>
            <div className="bg-blue-500/10 p-2.5 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sent</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">8,920</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">+22% this month</p>
            </div>
            <div className="bg-amber-500/10 p-2.5 rounded-xl">
              <Smartphone className="w-5 h-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search SMS campaigns..."
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
                <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5" />
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
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Sender ID: <strong className="text-slate-800">{campaign.senderId}</strong> • Segment: <strong className="text-slate-700">{campaign.segment}</strong> • {campaign.scheduledAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-center shrink-0 text-right">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Recipients</p>
                  <p className="text-sm font-black text-slate-800">{campaign.sentCount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Delivery Rate</p>
                  <p className="text-sm font-black text-slate-800">{campaign.deliveryRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Create SMS Campaign
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Compose a short text message to send instantly to selected founders.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Campaign Name</Label>
              <Input
                placeholder="e.g. Flash Demo Day Alert"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Sender ID</Label>
                <Input value={newCampaign.senderId} disabled className="h-10 text-xs rounded-xl bg-slate-100 font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Target Segment</Label>
                <Select
                  value={newCampaign.segment}
                  onValueChange={(val) => setNewCampaign({ ...newCampaign, segment: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active Program Startups">Active Program Startups</SelectItem>
                    <SelectItem value="Pre-Seed Founders">Pre-Seed Founders</SelectItem>
                    <SelectItem value="Pending Applicants">Pending Applicants</SelectItem>
                    <SelectItem value="All Registered Founders">All Registered Founders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700">SMS Text Message</Label>
                <span className="text-[10px] font-bold text-slate-400">
                  {newCampaign.content.length} / 160 characters (1 SMS)
                </span>
              </div>
              <Textarea
                placeholder="Type your SMS message here..."
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                required
                maxLength={160}
                className="min-h-[100px] text-xs rounded-xl resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs h-9 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 rounded-xl px-5">
                Dispatch SMS
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
