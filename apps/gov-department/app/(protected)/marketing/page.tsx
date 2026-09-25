"use client";

import { useState } from "react";
import {
  Megaphone,
  Mail,
  MessageSquare,
  Send,
  Plus,
  Users,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Search,
  ArrowUpRight,
  Layers,
  FileText
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
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

interface Campaign {
  id: string;
  name: string;
  channel: "EMAIL" | "SMS" | "WHATSAPP";
  segment: string;
  status: "ACTIVE" | "SCHEDULED" | "COMPLETED" | "DRAFT";
  sentCount: number;
  openRate: string;
  clickRate: string;
  createdAt: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Summer Program 2026 Application Drip",
    channel: "EMAIL",
    segment: "Pre-Seed & Seed Founders",
    status: "ACTIVE",
    sentCount: 1420,
    openRate: "68.4%",
    clickRate: "24.1%",
    createdAt: "2 hours ago"
  },
  {
    id: "2",
    name: "Demo Day Founder Reminder",
    channel: "SMS",
    segment: "Active Program Startups",
    status: "SCHEDULED",
    sentCount: 350,
    openRate: "94.2%",
    clickRate: "41.0%",
    createdAt: "Tomorrow at 10:00 AM"
  },
  {
    id: "3",
    name: "Mentor Office Hours Broadcast",
    channel: "WHATSAPP",
    segment: "All Enrolled Founders",
    status: "COMPLETED",
    sentCount: 890,
    openRate: "98.1%",
    clickRate: "35.6%",
    createdAt: "3 days ago"
  },
  {
    id: "4",
    name: "Grant Application Final Reminder",
    channel: "EMAIL",
    segment: "Pending Applicants",
    status: "ACTIVE",
    sentCount: 2150,
    openRate: "59.3%",
    clickRate: "18.9%",
    createdAt: "5 days ago"
  }
];

const AUDIENCE_SEGMENTS = [
  { name: "All Enrolled Founders", count: 2450, growth: "+12% this month" },
  { name: "Active Program Startups", count: 350, growth: "100% active" },
  { name: "Pending Applicants", count: 1280, growth: "Requires nudge" },
  { name: "Mentors & Investors", count: 420, growth: "+5 new this week" }
];

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<"campaigns" | "automations" | "segments">("campaigns");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    channel: "EMAIL" as "EMAIL" | "SMS" | "WHATSAPP",
    segment: "All Enrolled Founders",
    content: "",
    subject: ""
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.content) {
      toast.error("Please fill in the campaign title and message content.");
      return;
    }

    const created: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      channel: newCampaign.channel,
      segment: newCampaign.segment,
      status: "ACTIVE",
      sentCount: newCampaign.segment === "All Enrolled Founders" ? 2450 : 350,
      openRate: "Pending",
      clickRate: "Pending",
      createdAt: "Just now"
    };

    setCampaigns([created, ...campaigns]);
    toast.success(`Campaign "${newCampaign.name}" launched via ${newCampaign.channel}!`);
    setIsModalOpen(false);
    setNewCampaign({
      name: "",
      channel: "EMAIL",
      segment: "All Enrolled Founders",
      content: "",
      subject: ""
    });
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesChannel = channelFilter === "ALL" || c.channel === channelFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.segment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="w-full px-1 sm:px-2 py-4 space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1A1A2E]/5 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1A1A2E] tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-[#F26522]" />
            Marketing & Campaigns
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#1A1A2E]/60 mt-1">
            Launch email, SMS, and WhatsApp drip campaigns to engage founders, applicants, and partners.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F26522] hover:bg-[#F26522]/90 text-white font-bold text-xs sm:text-sm rounded-xl px-5 h-11 shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </Button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Total Reach</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">24,850</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">+14% this month</p>
            </div>
            <div className="bg-blue-500/10 p-2.5 rounded-xl">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Avg Open Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">64.2%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">+8.5% industry avg</p>
            </div>
            <div className="bg-purple-500/10 p-2.5 rounded-xl">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white/60">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#1A1A2E]/40 uppercase tracking-widest">Avg Click Rate</p>
              <p className="text-2xl font-black text-[#1A1A2E] mt-1">18.5%</p>
              <p className="text-[10px] font-bold text-emerald-600 mt-0.5">High engagement</p>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-[#1A1A2E] text-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active Campaigns</p>
              <p className="text-2xl font-black text-white mt-1">{campaigns.filter(c => c.status === "ACTIVE").length}</p>
              <p className="text-[10px] font-bold text-[#F26522] mt-0.5">Running live</p>
            </div>
            <div className="bg-[#F26522]/20 p-2.5 rounded-xl">
              <Send className="w-5 h-5 text-[#F26522]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/50 pb-3">
        <div className="flex items-center gap-4">
          {[
            { id: "campaigns", label: "Campaigns" },
            { id: "automations", label: "Automations & Drips" },
            { id: "segments", label: "Audience Segments" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#F26522] text-[#F26522]"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "campaigns" && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-white/60 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-1 bg-white/60 p-1 rounded-lg border border-slate-200 shrink-0">
              {["ALL", "EMAIL", "SMS", "WHATSAPP"].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-colors ${
                    channelFilter === ch
                      ? "bg-[#1A1A2E] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === "campaigns" && (
        <div className="space-y-3">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border-none shadow-sm bg-white/70 hover:bg-white transition-all rounded-2xl">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                      campaign.channel === "EMAIL"
                        ? "bg-blue-500/10 text-blue-600"
                        : campaign.channel === "SMS"
                        ? "bg-purple-500/10 text-purple-600"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {campaign.channel === "EMAIL" && <Mail className="w-5 h-5" />}
                      {campaign.channel === "SMS" && <MessageSquare className="w-5 h-5" />}
                      {campaign.channel === "WHATSAPP" && <Send className="w-5 h-5" />}
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
                      <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
                        <span>Segment: <strong className="text-slate-700">{campaign.segment}</strong></span>
                        <span>•</span>
                        <span>{campaign.createdAt}</span>
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
            ))
          ) : (
            <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-slate-200">
              <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">No campaigns found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your channel filter or create a new campaign.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "automations" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-none shadow-sm bg-white/70 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px]">Email Drip</Badge>
              <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-none text-[10px]">Active</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Founder Onboarding Sequence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automated 4-step email sequence triggered upon new founder signup to complete profile, submit pitch deck, and explore startup hubs.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-semibold border-t border-slate-100">
              <span>4 Steps • 1,240 Enrolled</span>
              <span className="text-[#F26522]">72.4% Open Rate</span>
            </div>
          </Card>

          <Card className="border-none shadow-sm bg-white/70 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px]">WhatsApp Auto-Alert</Badge>
              <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-none text-[10px]">Active</Badge>
            </div>
            <h3 className="font-bold text-slate-900 text-base">Program Application Status Broadcast</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Instant WhatsApp notifications when application status updates from Submitted to Interview or Accepted.
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-semibold border-t border-slate-100">
              <span>Instant • 890 Sent</span>
              <span className="text-[#F26522]">98.1% Delivery Rate</span>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "segments" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE_SEGMENTS.map((segment, idx) => (
            <Card key={idx} className="border-none shadow-sm bg-white/70 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{segment.name}</p>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl font-black text-slate-900">{segment.count}</p>
              <p className="text-[10px] font-bold text-emerald-600">{segment.growth}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Create Campaign Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[540px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#F26522]" />
              Create New Campaign
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure and send email, SMS, or WhatsApp campaigns to your target audience.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCampaign} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cname" className="text-xs font-bold text-slate-700">Campaign Name</Label>
              <Input
                id="cname"
                placeholder="e.g. Q3 Program Applications Announcement"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                required
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Channel</Label>
                <Select
                  value={newCampaign.channel}
                  onValueChange={(val: any) => setNewCampaign({ ...newCampaign, channel: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Target Segment</Label>
                <Select
                  value={newCampaign.segment}
                  onValueChange={(val: any) => setNewCampaign({ ...newCampaign, segment: val })}
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

            {newCampaign.channel === "EMAIL" && (
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs font-bold text-slate-700">Email Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="e.g. Applications for Summer Program 2026 are now open!"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-xs font-bold text-slate-700">Message Content</Label>
              <Textarea
                id="content"
                placeholder="Write your campaign body or template message..."
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                required
                className="min-h-[110px] text-xs rounded-xl resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs h-9 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#F26522] hover:bg-[#F26522]/90 text-white font-bold text-xs h-9 rounded-xl px-5"
              >
                Launch Campaign
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
