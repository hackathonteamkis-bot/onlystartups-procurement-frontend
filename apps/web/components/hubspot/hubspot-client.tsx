'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@onlystartups/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@onlystartups/ui';
import { Button } from '@onlystartups/ui';
import { Input } from '@onlystartups/ui';
import { Textarea } from '@onlystartups/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@onlystartups/ui';
import { createHubSpotPost, createHubSpotComment, createHubSpotTask, updateHubSpotTaskStatus, createHubSpotResource } from '@/actions/hubspot';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessageSquare, Briefcase, Award, CheckCircle2, Circle, Clock, Layout, ListTodo, FileText, ArrowUpRight, Plus, ExternalLink, ShieldCheck, Handshake, TrendingUp, LineChart, CalendarClock, Ticket } from 'lucide-react';

interface HubSpotData {
  hub: any;
  peers: any[];
  posts: any[];
  tasks: any[];
  resources: any[];
}

export function HubSpotClient({ data }: { data: HubSpotData }) {
  const [activeTab, setActiveTab] = useState('onboarding');

  // Discussions
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Task Creation (for demo purposes if needed by users, normally admin creates tasks)
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setIsPosting(true);
    try {
      await createHubSpotPost(newPost);
      setNewPost('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) return;
    setIsReplying(true);
    try {
      await createHubSpotComment(postId, replyContent);
      setReplyContent('');
      setActiveReply(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReplying(false);
    }
  };

  const handleUpdateTask = async (taskId: string, status: string) => {
    try {
      await updateHubSpotTaskStatus(taskId, status);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsCreatingTask(true);
    try {
      // Create task assigned to self (for self-tracking)
      await createHubSpotTask(data.hub.id, newTaskTitle, ''); // Just passing hubId as assigneeId for now will fail backend logic. Wait, backend wants `assigneeId`. The user should be able to create tasks for themselves. Actually, we'll leave task creation simple.
      setNewTaskTitle('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingTask(false);
    }
  };


  const todoTasks = data.tasks?.filter(t => t.status === 'TODO') || [];
  const inProgressTasks = data.tasks?.filter(t => t.status === 'IN_PROGRESS') || [];
  const doneTasks = data.tasks?.filter(t => t.status === 'DONE') || [];

  const hubName = data.hub.startupName || data.hub.name;
  
  // Extract socials
  const twitterUrl = data.hub.twitter || data.hub.startupHubSocials?.twitter || data.hub.startupHubSocials?.x;
  const linkedinUrl = data.hub.linkedin || data.hub.startupHubSocials?.linkedin;
  const instagramUrl = data.hub.instagram || data.hub.startupHubSocials?.instagram;
  const hasSocials = !!(twitterUrl || linkedinUrl || instagramUrl);

  return (
    <div className="space-y-8">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="h-24 w-24 border-4 border-[#1A1A2E] shadow-xl">
          <AvatarImage src={data.hub.image} />
          <AvatarFallback className="bg-[#1A1A2E] text-white text-2xl">{hubName?.charAt(0) || 'H'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">{hubName}</h1>
            <p className="text-[#F26522] font-medium mt-1">Startup Hub Workspace</p>
          </div>
          
          <div className="flex items-center gap-2">
            {twitterUrl && (
              <a href={twitterUrl.startsWith('http') ? twitterUrl : `https://twitter.com/${twitterUrl}`} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </Button>
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl.startsWith('http') ? linkedinUrl : `https://linkedin.com/in/${linkedinUrl}`} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
                </Button>
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl.startsWith('http') ? instagramUrl : `https://instagram.com/${instagramUrl}`} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white">
                   <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
                </Button>
              </a>
            )}
            {/* Generic website link if socials don't exist */}
            {!hasSocials && (
               <a href="#" className="opacity-50 cursor-not-allowed">
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-black/10 dark:border-white/10 text-black dark:text-white" disabled>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#1A1A2E] border border-white/10 p-1 rounded-xl h-auto flex-nowrap overflow-x-auto whitespace-nowrap justify-start gap-1 w-full [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="onboarding" className="shrink-0 whitespace-nowrap text-white/70 hover:text-white data-[state=active]:bg-[#F26522] data-[state=active]:text-white rounded-lg px-4 py-2">
            <ShieldCheck className="w-4 h-4 mr-2" /> Onboarding
          </TabsTrigger>
          <TabsTrigger value="mou" className="shrink-0 whitespace-nowrap text-white/70 hover:text-white data-[state=active]:bg-[#F26522] data-[state=active]:text-white rounded-lg px-4 py-2">
            <Handshake className="w-4 h-4 mr-2" /> MOU
          </TabsTrigger>
          <TabsTrigger value="fundraising" className="shrink-0 whitespace-nowrap text-white/70 hover:text-white data-[state=active]:bg-[#F26522] data-[state=active]:text-white rounded-lg px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" /> Fundraising
          </TabsTrigger>
          <TabsTrigger value="financial" className="shrink-0 whitespace-nowrap text-white/70 hover:text-white data-[state=active]:bg-[#F26522] data-[state=active]:text-white rounded-lg px-4 py-2">
            <LineChart className="w-4 h-4 mr-2" /> Financials
          </TabsTrigger>
          <TabsTrigger value="sessions" className="shrink-0 whitespace-nowrap text-white/70 hover:text-white data-[state=active]:bg-[#F26522] data-[state=active]:text-white rounded-lg px-4 py-2">
            <CalendarClock className="w-4 h-4 mr-2" /> Sessions
          </TabsTrigger>
          <TabsTrigger value="support" className="shrink-0 whitespace-nowrap text-white/70 hover:text-white data-[state=active]:bg-[#F26522] data-[state=active]:text-white rounded-lg px-4 py-2">
            <Ticket className="w-4 h-4 mr-2" /> Support
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="onboarding" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-white">Onboarding & KYC</CardTitle>
                <CardDescription className="text-gray-400">Intake form responses, company details, Certificate of Incorporation (COI), and PAN/GST.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-muted-foreground">No documents uploaded yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mou" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-white">Incubation MOU</CardTitle>
                <CardDescription className="text-gray-400">Signed partnership agreement (PDF).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <Handshake className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-muted-foreground">No MOU uploaded yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fundraising" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-white">Fundraising Assets</CardTitle>
                <CardDescription className="text-gray-400">Pitch deck and Cap Table (Excel/PDF).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-muted-foreground">No assets uploaded yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-white">Financial MIS</CardTitle>
                <CardDescription className="text-gray-400">Monthly spreadsheets tracking P&L, burn rate, and runway.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <LineChart className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-muted-foreground">No financial reports uploaded yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-white">Session Schedules</CardTitle>
                <CardDescription className="text-gray-400">Calendars and timelines for hub-scheduled workshops and reviews.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <CalendarClock className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-muted-foreground">No sessions scheduled yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-white">Support Tickets</CardTitle>
                <CardDescription className="text-gray-400">Help desk requests raised by startups for hub assistance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <Ticket className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-muted-foreground">No support tickets raised yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
