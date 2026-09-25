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
import { Rocket, Shield, XCircle, Search } from "lucide-react";

export default function StartupsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Startup Moderation"
        description="Verify, suspend, and review startups on the platform."
      >
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search startups..." 
            className="w-full pl-9 pr-4 py-2 bg-white/50 border border-[#1A1A2E]/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </PageHeader>

      <Card className="border-[#1A1A2E]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#1A1A2E]/5 text-[#1A1A2E]/70 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Startup Name</th>
                <th className="px-6 py-4 font-semibold">Founder</th>
                <th className="px-6 py-4 font-semibold">Phase</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No startups found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
