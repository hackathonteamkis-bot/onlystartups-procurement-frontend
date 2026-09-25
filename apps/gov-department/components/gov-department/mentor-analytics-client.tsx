"use client";

import { PageHeader } from "@/components/shared/page-header";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@onlystartups/ui";
import { Users2, CalendarCheck, TrendingUp, Medal } from "lucide-react";
import Link from "next/link";

export function MentorAnalyticsClient({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Mentor Analytics"
        description="High-level metrics and oversight of your mentor network."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Users2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Mentors</p>
              <h3 className="text-3xl font-bold text-[#1A1A2E]">{data.totalMentors || 0}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
              <h3 className="text-3xl font-bold text-[#1A1A2E]">{data.totalSessions || 0}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 rounded-full">
              <CalendarCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Sessions</p>
              <h3 className="text-3xl font-bold text-[#1A1A2E]">{data.completedSessions || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              Top Active Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topMentors?.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No mentor activity yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.topMentors?.map((mentor: any, i: number) => (
                  <Link href={`/gov-department/mentors/${mentor.id}`} key={mentor.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-muted-foreground w-4 text-center">{i + 1}</div>
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={mentor.image} />
                        <AvatarFallback>{mentor.name?.charAt(0) || "M"}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold text-[#1A1A2E]">{mentor.name}</p>
                    </div>
                    <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {mentor.sessionCount} Sessions
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
