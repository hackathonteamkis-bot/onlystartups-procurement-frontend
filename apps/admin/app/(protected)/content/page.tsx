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
import { FileText, Plus, Calendar, Coins } from "lucide-react";

export default function ContentPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Content Management"
        description="Manage global events, grants, and platform-wide resources."
      >
        <Button className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Create Content
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#1A1A2E]/5 hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>Global Events</CardTitle>
                <CardDescription>Manage platform-wide events and webinars.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
              No active events found. Click &apos;Create Content&apos; to schedule one.
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1A1A2E]/5 hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Funding Opportunities</CardTitle>
                <CardDescription>Manage global grants and funding opportunities.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             <div className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
              No active grants found. Click &apos;Create Content&apos; to launch one.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
