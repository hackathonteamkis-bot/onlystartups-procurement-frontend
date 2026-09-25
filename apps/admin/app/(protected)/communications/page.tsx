"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Send, Users, Building, Rocket } from "lucide-react";

export default function CommunicationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Broadcast Communications"
        description="Send mass emails or system notifications to user segments."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-[#1A1A2E]/5">
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>Draft your broadcast message to be sent via email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Line</label>
              <Input placeholder="Enter email subject..." className="bg-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message Body</label>
              <textarea 
                className="w-full min-h-[250px] p-3 rounded-md border border-input bg-white text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Type your message here..."
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white gap-2">
                <Send className="w-4 h-4" /> Send Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-[#1A1A2E]/5">
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Select who will receive this message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[#1A1A2E]/10 cursor-pointer hover:bg-[#1A1A2E]/5 transition-colors">
                <input type="radio" name="audience" defaultChecked className="w-4 h-4 accent-[#1A1A2E]" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">All Users</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[#1A1A2E]/10 cursor-pointer hover:bg-[#1A1A2E]/5 transition-colors">
                <input type="radio" name="audience" className="w-4 h-4 accent-[#1A1A2E]" />
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Startup Hubs</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-[#1A1A2E]/10 cursor-pointer hover:bg-[#1A1A2E]/5 transition-colors">
                <input type="radio" name="audience" className="w-4 h-4 accent-[#1A1A2E]" />
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Startups</span>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
