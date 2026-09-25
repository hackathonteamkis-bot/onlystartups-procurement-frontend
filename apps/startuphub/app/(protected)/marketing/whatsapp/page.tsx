"use client";

import { useState } from "react";
import {
  Send,
  Plus,
  MessageSquare,
  Users,
  CheckCheck,
  TrendingUp,
  Search,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Share2
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

interface WhatsAppCampaign {
  id: string;
  name: string;
  templateCategory: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  segment: string;
  status: "ACTIVE" | "SCHEDULED" | "COMPLETED" | "DRAFT";
  sentCount: number;
  readRate: string;
  scheduledAt: string;
}

const INITIAL_WHATSAPP_CAMPAIGNS: WhatsAppCampaign[] = [
  {
    id: "w1",
    name: "Mentor Office Hours Broadcast",
    templateCategory: "UTILITY",
    segment: "All Enrolled Founders",
    status: "COMPLETED",
    sentCount: 890,
    readRate: "98.1%",
    scheduledAt: "Sent 3 days ago"
  },
  {
    id: "w2",
    name: "Program Application Status Instant Update",
    templateCategory: "UTILITY",
    segment: "Pending Applicants",
    status: "ACTIVE",
    sentCount: 1240,
    readRate: "94.6%",
    scheduledAt: "Automated trigger"
  },
  {
    id: "w3",
    name: "Demo Day Founder Pitch Deck Submissions",
    templateCategory: "MARKETING",
    segment: "Active Program Startups",
    status: "SCHEDULED",
    sentCount: 350,
    readRate: "--",
    scheduledAt: "Tomorrow at 2:00 PM"
  }
];

export default function WhatsAppCampaignsPage() {
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>(INITIAL_WHATSAPP_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    templateCategory: "UTILITY" as "UTILITY" | "MARKETING",
    segment: "All Enrolled Founders",
    content: ""
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.content) {
      toast.error("Please fill in the campaign name and WhatsApp message body.");
      return;
    }

    const created: WhatsAppCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      templateCategory: newCampaign.templateCategory,
      segment: newCampaign.segment,
      status: "ACTIVE",
      sentCount: 890,
      readRate: "Pending",
      scheduledAt: "Just now"
    };

    setCampaigns([created, ...campaigns]);
    toast.success(`WhatsApp broadcast "${newCampaign.name}" sent via Meta Business API!`);
    setIsModalOpen(false);
    setNewCampaign({ name: "", templateCategory: "UTILITY", segment: "All Enrolled Founders", content: "" });
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
            <Send className="w-6 h-6 text-emerald-600" />
            WhatsApp Campaigns
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#1A1A2E]/60 mt-1">
            Broadcast Meta-approved WhatsApp messages with interactive call-to-action buttons directly to founders.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl px-5 h-11 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create WhatsApp Campaign
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meta API Status</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">Connected</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Official Green Badge</p>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">99.8%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Near instant</p>
            </div>
            <div className="bg-blue-500/10 p-2.5 rounded-xl">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Read Receipt Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">92.4%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Highest engagement</p>
            </div>
            <div className="bg-purple-500/10 p-2.5 rounded-xl">
              <CheckCheck className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Sent</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">12,300</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">+30% this month</p>
            </div>
            <div className="bg-amber-500/10 p-2.5 rounded-xl">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search WhatsApp campaigns..."
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
                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-[#1A1A2E] text-base">{campaign.name}</p>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-none bg-emerald-50 text-emerald-600">
                      {campaign.templateCategory}
                    </Badge>
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
                  <p className="text-[10px] font-bold uppercase text-slate-400">Read Rate</p>
                  <p className="text-sm font-black text-slate-800">{campaign.readRate}</p>
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
              <Send className="w-5 h-5 text-emerald-600" />
              Create WhatsApp Campaign
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Broadcast a Meta Business API approved WhatsApp message template to founders.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Campaign Title</Label>
              <Input
                placeholder="e.g. Founder Demo Day Schedule Announcement"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Template Category</Label>
                <Select
                  value={newCampaign.templateCategory}
                  onValueChange={(val: any) => setNewCampaign({ ...newCampaign, templateCategory: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTILITY">Utility / Updates</SelectItem>
                    <SelectItem value="MARKETING">Marketing / Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Target Segment</Label>
                <Select
                  value={newCampaign.segment}
                  onValueChange={(val) => setNewCampaign({ ...newCampaign, segment: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Enrolled Founders">All Enrolled Founders</SelectItem>
                    <SelectItem value="Active Program Startups">Active Program Startups</SelectItem>
                    <SelectItem value="Pending Applicants">Pending Applicants</SelectItem>
                    <SelectItem value="Mentors & Investors">Mentors & Investors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">WhatsApp Message Body</Label>
              <Textarea
                placeholder="Hi {{1}}, your application for {{2}} has been updated..."
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                required
                className="min-h-[110px] text-xs rounded-xl resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs h-9 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl px-5">
                Broadcast WhatsApp
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
