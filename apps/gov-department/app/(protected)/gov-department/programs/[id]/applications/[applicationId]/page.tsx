"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProgramById } from "@/actions/gov-department/programs";
import { getGovDepartmentProgramApplications, updateApplicationStatus } from "@/actions/explore/apply";
import { Loader2, ArrowLeft, Linkedin, Twitter, Instagram, Globe } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@onlystartups/ui";

export default function ApplicationViewPage() {
  const params = useParams();
  const programId = Array.isArray(params.id) ? params.id[0] : params.id;
  const applicationId = Array.isArray(params.applicationId) ? params.applicationId[0] : params.applicationId;
  
  const [program, setProgram] = useState<any>(null);
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!programId || !applicationId) return;
      try {
        const [programRes, appsRes] = await Promise.all([
          getProgramById(programId),
          getGovDepartmentProgramApplications(programId)
        ]);
        
        if (programRes && !programRes.error) {
          setProgram(programRes);
        }
        if (appsRes) {
          let applications = [];
          if (Array.isArray(appsRes)) {
            applications = appsRes;
          } else if (appsRes.applications) {
            applications = appsRes.applications;
          }
          const found = applications.find((a: any) => a.id === applicationId);
          if (found) {
            setApp(found);
          }
        }
      } catch (e) {
        toast.error("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [programId, applicationId]);

  const handleStatusUpdate = async (status: "APPROVED" | "REJECTED") => {
    if (!applicationId) return;
    try {
      const res = await updateApplicationStatus(applicationId as string, status);
      if (res.success) {
        toast.success(res.success);
        setApp((prev: any) => ({ ...prev, status }));
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (!app || !program) {
    return <div className="p-12 text-center text-gray-500">Application not found.</div>;
  }

  const questions = program?.applicationQuestions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <Link href={`/gov-department/programs/${programId}`} className="text-xs font-black text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors tracking-widest uppercase w-fit">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Program
        </Link>
        <PageHeader title={`Application Details`}>
          <Badge variant={app.status === 'PENDING' ? 'secondary' : 'default'} className={app.status === 'APPROVED' ? 'bg-green-500' : app.status === 'REJECTED' ? 'bg-red-500' : ''}>
            {app.status}
          </Badge>
        </PageHeader>
      </div>

      <div className="bg-white/40 backdrop-blur-xl p-8 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] border border-white/60 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex items-start gap-6 mb-8">
          <Avatar className="h-20 w-20 border-2 border-white/80 shadow-sm mt-1">
            <AvatarImage src={app.user.image || ""} />
            <AvatarFallback>{`${app.user.firstName || ''} ${app.user.lastName || ''}`.trim()?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {`${app.user.firstName || ''} ${app.user.lastName || ''}`.trim()}
                {app.user.startupName && <span className="text-gray-400 font-normal text-lg">@ {app.user.startupName}</span>}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <span className="font-medium text-gray-800">{app.user.title || "Founder"}</span>
                <span>•</span>
                <span>{app.user.email}</span>
                {app.user.yearsOfExperience && (
                  <>
                    <span>•</span>
                    <span>{app.user.yearsOfExperience} Exp</span>
                  </>
                )}
              </div>
            </div>

            {app.user.bio && (
              <div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl border border-white/40 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]">
                <p className="text-sm text-gray-700 italic leading-relaxed">&quot;{app.user.bio}&quot;</p>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              {app.user.startupPhase && (
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider bg-blue-50/80 text-blue-700 border border-blue-100">
                  {app.user.startupPhase}
                </Badge>
              )}
              {app.user.skills && app.user.skills.length > 0 && (
                app.user.skills.map((skill: string) => (
                  <Badge key={skill} variant="outline" className="text-[10px] font-medium bg-white/50 text-gray-700 border-gray-200/50">
                    {skill}
                  </Badge>
                ))
              )}
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-white/40">
              {app.user.linkedin && (
                <a href={app.user.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/50 border border-white/60 shadow-sm text-blue-600 hover:bg-white/80 transition-colors" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {app.user.twitter && (
                <a href={`https://twitter.com/${app.user.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/50 border border-white/60 shadow-sm text-blue-400 hover:bg-white/80 transition-colors" title="Twitter/X">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {app.user.instagram && (
                <a href={`https://instagram.com/${app.user.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/50 border border-white/60 shadow-sm text-pink-600 hover:bg-white/80 transition-colors" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {app.user.websiteUrl && (
                <a href={app.user.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/50 border border-white/60 shadow-sm text-gray-700 hover:bg-white/80 transition-colors" title="Website">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="space-y-6">
              {app.pitchUrl && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Pitch Deck URL</h3>
                  <a href={app.pitchUrl} target="_blank" rel="noopener noreferrer" className="text-base text-blue-600 hover:underline break-all">
                    {app.pitchUrl}
                  </a>
                </div>
              )}
              {app.message && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Cover Letter</h3>
                  <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-sm">
                    <p className="text-base text-gray-800 whitespace-pre-wrap">{app.message}</p>
                  </div>
                </div>
              )}
              {!app.pitchUrl && !app.message && (
                <p className="text-sm text-gray-500">No application details provided.</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q: any, idx: number) => {
                const ans = app.answers?.[q.id];
                return (
                  <div key={q.id}>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{idx + 1}. {q.label}</h3>
                    <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/60 shadow-sm transition-all hover:bg-white/60">
                      <p className="text-base text-gray-800 whitespace-pre-wrap">
                        {Array.isArray(ans) ? ans.join(", ") : ans || "No answer provided"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {app.status === "PENDING" && (
          <div className="mt-10 flex gap-4 pt-6 border-t border-gray-200/50">
            <button onClick={() => handleStatusUpdate("APPROVED")} className="flex-1 py-3 bg-green-500/90 backdrop-blur text-white hover:bg-green-600 rounded-xl text-sm font-bold shadow-sm transition-all">
              Accept Application
            </button>
            <button onClick={() => handleStatusUpdate("REJECTED")} className="flex-1 py-3 bg-red-50/80 backdrop-blur text-red-600 border border-red-100 hover:bg-red-100 rounded-xl text-sm font-bold shadow-sm transition-all">
              Reject Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
