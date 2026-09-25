"use client";

import { PageHeader } from "@/components/shared/page-header";
import { 
  Card, 
  CardContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
} from "@onlystartups/ui";
import { Users2, Mail } from "lucide-react";

export function MentorsDirectoryClient({ mentors }: { mentors: any[] }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Mentor Directory"
        description="Connect with industry experts from your hub."
      />

      {mentors.length === 0 ? (
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center h-64">
            <div className="p-4 bg-blue-50 rounded-full mb-4">
              <Users2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">No Mentors Available</h2>
            <p className="text-[#1A1A2E]/60 max-w-md mx-auto">
              Your hub hasn&apos;t onboarded any mentors yet, or you are not currently assigned to an active hub.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map(mentor => (
            <Card key={mentor.id} className="border-none shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                    <AvatarImage src={mentor.user.image} />
                    <AvatarFallback className="bg-[#1A1A2E] text-white">
                      {`${(mentor.user as any).firstName || ''} ${(mentor.user as any).lastName || ''}`.trim()?.charAt(0) || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-[#1A1A2E] leading-tight">{`${(mentor.user as any).firstName || ''} ${(mentor.user as any).lastName || ''}`.trim()}</h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {mentor.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-6">
                  {mentor.expertise?.map((exp: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-[#F26522]/10 text-[#F26522] text-[10px] font-medium border-none">
                      {exp}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white rounded-full"
                  onClick={() => window.location.href = `mailto:${mentor.user.email}?subject=Mentorship Request`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Mentor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
