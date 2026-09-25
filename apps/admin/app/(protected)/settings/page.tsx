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
import { Settings, Save, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Platform Settings"
        description="Configure global platform options and security settings."
      >
        <Button className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[#1A1A2E]/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <CardTitle>Security & Access</CardTitle>
            </div>
            <CardDescription>Manage registration access and domains.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                <p className="font-medium text-sm">Allow Public Registration</p>
                <p className="text-xs text-muted-foreground">Anyone can sign up as a user.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A1A2E]"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1A1A2E]/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-500" />
              <CardTitle>System Maintenance</CardTitle>
            </div>
            <CardDescription>Database and cache management.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                <p className="font-medium text-sm">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Disable access to the platform for all non-admins.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
