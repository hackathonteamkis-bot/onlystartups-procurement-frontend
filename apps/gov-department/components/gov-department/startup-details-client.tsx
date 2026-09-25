"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@onlystartups/ui";
import { PageHeader } from "@/components/shared/page-header";
import {
  ShieldCheck,
  Handshake,
  TrendingUp,
  LineChart,
  CalendarClock,
  Ticket,
} from "lucide-react";

export function StartupDetailsClient({ startup }: { startup: any }) {
  const [activeTab, setActiveTab] = useState("onboarding");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title={startup.startupName || startup.name || "Unnamed Startup"}
        description={startup.email}
      />

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
            <Card className="bg-[#1A1A2E] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#F26522]" /> Onboarding & KYC
                </CardTitle>
                <CardDescription className="text-white/50">
                  Intake form responses, company details, Certificate of Incorporation (COI), and PAN/GST.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/40 text-sm">Coming soon — document management will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mou" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-[#F26522]" /> Incubation MOU
                </CardTitle>
                <CardDescription className="text-white/50">
                  Signed partnership agreement (PDF).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/40 text-sm">Coming soon — MOU uploads will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fundraising" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#F26522]" /> Fundraising Assets
                </CardTitle>
                <CardDescription className="text-white/50">
                  Pitch deck and Cap Table (Excel/PDF).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/40 text-sm">Coming soon — fundraising assets will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-[#F26522]" /> Financial MIS
                </CardTitle>
                <CardDescription className="text-white/50">
                  Monthly spreadsheets tracking P&L, burn rate, and runway.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/40 text-sm">Coming soon — financial reports will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-[#F26522]" /> Session Schedules
                </CardTitle>
                <CardDescription className="text-white/50">
                  Calendars and timelines for hub-scheduled workshops and reviews.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/40 text-sm">Coming soon — session scheduling will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="mt-0 outline-none">
            <Card className="bg-[#1A1A2E] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#F26522]" /> Support Tickets
                </CardTitle>
                <CardDescription className="text-white/50">
                  Help desk requests raised by startups for hub assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/40 text-sm">Coming soon — support tickets will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
