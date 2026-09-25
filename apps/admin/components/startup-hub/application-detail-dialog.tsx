"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Badge } from "@onlystartups/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Separator } from "@onlystartups/ui";
import { useSession } from "next-auth/react";

interface ApplicationDetailDialogProps {
  application: {
    id: string;
    type: string;
    status: string;
    createdAt: string;
    message?: string;
    pitchUrl?: string;
    startupStage?: string;
    answers?: Record<string, any>;
    user: {
      name?: string;
      email?: string;
      image?: string;
      startupName?: string;
      startupPhase?: string;
      title?: string;
      linkedin?: string;
      bio?: string;
      startupDescription?: string;
    };
    grant?: {
      name: string;
    };
  };
  trigger?: React.ReactNode;
}

export function ApplicationDetailDialog({
  application,
  trigger,
}: ApplicationDetailDialogProps) {
  const { data: session } = useSession();
  const user = application.user;
  const questions = (session?.user?.applicationQuestions as any[]) || [];
  const answers = (application.answers as Record<string, any>) || {};
  const hasCustomAnswers = Object.keys(answers).length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-widest"
          >
            View Details
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogDescription className="sr-only">
            Application details for {user.startupName || `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim()}
          </DialogDescription>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 rounded-lg border-2 border-primary/10">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-[#1A1A2E] text-white text-xl font-bold">
                {user.startupName?.charAt(0) || `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim()?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-black text-[#1A1A2E]">
                {user.startupName || `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim()}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-medium">
                {user.title}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Startup Status Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-xl space-y-1">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Target / Type
              </p>
              <p className="text-sm font-bold text-[#1A1A2E]">
                {application.type === "GRANT"
                  ? `GRANT: ${application.grant?.name}`
                  : "STARTUP_HUB ENROLLMENT"}
              </p>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl space-y-1">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Applied On
              </p>
              <p className="text-sm font-bold text-[#1A1A2E]">
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-muted/30 p-4 rounded-xl space-y-1">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                Startup Stage
              </p>
              <p className="text-sm font-bold text-[#1A1A2E] truncate">
                {application.startupStage?.replace("_", " ") ||
                  application.user?.startupPhase?.replace("_", " ") ||
                  "NOT SPECIFIED"}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-2">
            {user.email && (
              <Badge
                variant="secondary"
                className="px-3 py-1 rounded-lg gap-2 bg-white border border-muted text-foreground"
              >
                {user.email}
              </Badge>
            )}
            {user.linkedin && (
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 rounded-lg gap-2 bg-white border border-muted text-foreground hover:bg-muted/50 transition-colors"
                >
                  LinkedIn
                </Badge>
              </a>
            )}
            {application.pitchUrl && (
              <a
                href={application.pitchUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  variant="secondary"
                  className="px-3 py-1 rounded-lg gap-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
                >
                  Pitch Deck
                </Badge>
              </a>
            )}
          </div>

          <Separator className="bg-muted/50" />

          {/* Problem/Message or Custom Answers */}
          {hasCustomAnswers ? (
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Custom Questionnaire Responses
              </h4>
              <div className="space-y-4 bg-[#F5F5EE]/40 p-5 rounded-xl border border-muted/50">
                {/* Active questions in customize builder order */}
                {questions.map((q) => {
                  const val = answers[q.id];
                  return (
                    <div key={q.id} className="space-y-1">
                      <p className="text-[9px] font-black text-primary uppercase tracking-wider">
                        {q.label}
                      </p>
                      <p className="text-xs font-bold text-[#1A1A2E] leading-relaxed">
                        {Array.isArray(val)
                          ? val.join(", ")
                          : val !== undefined && val !== ""
                          ? val.toString()
                          : <span className="text-muted-foreground font-medium italic">No response</span>}
                      </p>
                    </div>
                  );
                })}

                {/* Legacy/Deleted questions fallback */}
                {Object.entries(answers)
                  .filter(([key]) => !questions.some((q) => q.id === key))
                  .map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">
                        {`Field (${key})`}
                      </p>
                      <p className="text-xs font-bold text-[#1A1A2E] leading-relaxed">
                        {Array.isArray(val)
                          ? val.join(", ")
                          : val !== undefined && val !== ""
                          ? val.toString()
                          : <span className="text-muted-foreground font-medium italic">No response</span>}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Application Message
              </h4>
              <div className="bg-muted/20 p-5 rounded-lg border border-muted/30">
                <p className="text-sm text-foreground leading-relaxed italic">
                  &quot;{application.message || "No application message provided."}&quot;
                </p>
              </div>
            </div>
          )}

          {/* Founder Bio */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              About the Founder
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user.bio || user.startupDescription || "No biography provided."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
