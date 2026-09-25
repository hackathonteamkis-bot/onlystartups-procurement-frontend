export const dynamic = "force-dynamic";

import { getProgramByIdPublic } from "@/actions/explore";
import {
  ArrowLeft,
  Info,
  Calendar,
  FileText,
  Clock,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@onlystartups/ui";
import { Badge, BreadcrumbUpdater, Separator } from "@onlystartups/ui";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";

interface ProgramDetailPageProps {
  params: Promise<{ id: string; programId: string }>;
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const { id, programId } = await params;
  const res = await getProgramByIdPublic(programId);

  if (!res || "error" in res) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-center">
        <FileText className="w-12 h-12 text-muted-foreground/20" />
        <h2 className="text-xl font-bold">Program not found</h2>
        <Link
          href="/explore/programs"
          className="text-primary hover:underline font-semibold"
        >
          Back to Programs
        </Link>
      </div>
    );
  }

  const program = res;
  
  const formatDate = (date: any) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-0 pb-20">
      <BreadcrumbUpdater id={id} name={program.govDepartment?.startupName || program.govDepartment?.name || "Startup Hub"} />
      <BreadcrumbUpdater id={programId} name={program.name} />

      {/* Nav */}
      <div className="hidden md:flex">
        <Link
          href="/explore/programs"
          className="text-xs font-bold text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO PROGRAMS
        </Link>
      </div>

      {/* Mobile Thumbnail (Top) */}
      <div className="block md:hidden aspect-video rounded-none sm:rounded-2xl overflow-hidden bg-[#F5F5EE]/30 relative -mx-4 w-[calc(100%+2rem)] sm:mx-0 sm:w-full">
        {program.thumbnail ? (
          <Image src={program.thumbnail} alt={program.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl font-black text-muted-foreground/20">OS</div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-2 md:mt-6">
        
        {/* Left Sidebar */}
        <div className="order-2 md:order-1 md:w-5/12 lg:w-4/12 xl:w-3/12 space-y-6">
          {/* Desktop Thumbnail */}
          <div className="hidden md:flex w-full aspect-video rounded-2xl overflow-hidden bg-[#F5F5EE]/30 items-center justify-center border border-muted/50 relative">
            {program.thumbnail ? (
              <Image src={program.thumbnail} alt={program.name} fill className="object-cover" />
            ) : (
              <div className="text-4xl font-black text-muted-foreground/20">OS</div>
            )}
          </div>
          
          {/* Startup Hub Info */}
          <div className="space-y-3">
             <h4 className="text-base sm:text-lg font-medium text-[#1A1A2E]">Presented By</h4>
             <Separator className="bg-black/10" />
             <div className="pt-1">
                <Link 
                  href={`/explore/gov-departments/${program.govDepartmentId}`}
                  className="flex items-center gap-3 w-full group"
                >
                  <Avatar className="h-10 w-10 rounded-lg shrink-0 group-hover:opacity-80 transition-opacity">
                    <AvatarImage src={program.govDepartment?.image || ""} className="object-cover" />
                    <AvatarFallback className="bg-[#1A1A2E] text-white font-black text-xs">
                      {program.govDepartment?.startupName?.charAt(0) || program.govDepartment?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A1A2E] whitespace-normal break-words group-hover:underline underline-offset-4">
                      {program.govDepartment?.startupName || program.govDepartment?.name}
                    </p>
                  </div>
                </Link>
             </div>
          </div>

          {/* Going / Applications Count */}
          {(program._count?.applications || 0) > 0 ? (
            <div className="space-y-3 pt-2">
               <h4 className="text-base sm:text-lg font-medium text-[#1A1A2E]">
                 <span>{program._count.applications} Applied</span>
               </h4>
               <Separator className="bg-black/10" />
               <div className="flex -space-x-3 pt-1">
                 {(program.recentApplicants || [...Array(Math.min(6, program._count.applications))]).map((applicant: any, i: number) => (
                   <Avatar key={applicant?.id || i} className="h-8 w-8 border-2 border-[#F5F5EE] rounded-full">
                     {applicant?.image && <AvatarImage src={applicant.image} className="object-cover" />}
                     <AvatarFallback className={`text-[10px] text-white font-bold ${
                       ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'][i % 5]
                     }`}>
                       {(applicant?.name || String.fromCharCode(65 + i)).charAt(0).toUpperCase()}
                     </AvatarFallback>
                   </Avatar>
                 ))}
               </div>
               <p className="text-sm font-medium text-muted-foreground pt-1">
                 {program._count.applications > 2 
                   ? `${program.recentApplicants?.[0]?.name || 'Someone'}, ${program.recentApplicants?.[1]?.name || 'Someone'} and ${program._count.applications - 2} others`
                   : program._count.applications === 2
                   ? `${program.recentApplicants?.[0]?.name || 'Someone'} and ${program.recentApplicants?.[1]?.name || 'Someone'}`
                   : `${program.recentApplicants?.[0]?.name || 'Someone'}`}
               </p>
            </div>
          ) : null}
        </div>

        {/* Right Main Content */}
        <div className="order-1 md:order-2 md:w-7/12 lg:w-8/12 xl:w-9/12 space-y-8 md:pt-2">
          
          {/* Title & Badge */}
          <div className="space-y-4">
            <Badge className="bg-[#F26522]/10 text-[#F26522] border-none px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
              {program.status === 'INTAKE' ? 'Accepting Applications' : program.status}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A2E] tracking-tight leading-tight break-words">
              {program.name}
            </h1>
          </div>


          {/* Quick Date/Time Info */}
          <div className="flex flex-col xl:flex-row gap-5 xl:gap-12 text-sm font-medium text-[#1A1A2E]">
             <div className="flex items-start gap-3">
               <Calendar className="w-4 h-4 text-[#1A1A2E] mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-bold text-base">{formatDate(program.startDate)} - {formatDate(program.endDate)}</span>
                 <span className="text-muted-foreground text-[10px] uppercase tracking-widest mt-1">Program Dates</span>
               </div>
             </div>
             <div className="flex items-start gap-3">
               <Clock className="w-4 h-4 text-[#1A1A2E] mt-1 shrink-0" />
               <div className="flex flex-col">
                 <span className="font-bold text-base">{program.programDuration || 'Duration varies'}</span>
                 <span className="text-muted-foreground text-[10px] uppercase tracking-widest mt-1">Duration</span>
               </div>
             </div>
          </div>

          {/* Registration Box */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 sm:p-8 space-y-6">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Registration</h3>
             <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#1A1A2E]" />
                    <h2 className="text-xl font-bold text-[#1A1A2E]">
                      {program.isApplied ? 'Application Submitted' : program.status === 'INTAKE' ? 'Open for Applications' : 'Applications Closed'}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {program.status === 'INTAKE' ? `Deadline to apply: ${formatDate(program.applicationDeadline)}` : 'This program is no longer taking new applications.'}
                  </p>
                </div>
                
                <div className="shrink-0 w-full sm:w-auto">
                  {program.isApplied ? (
                    <Link
                      key="btn-submitted"
                      href={`/explore/gov-departments/${id}/programs/${programId}/apply`}
                      className="w-full sm:w-auto inline-block px-8 py-3 bg-muted text-[#1A1A2E] hover:bg-muted/80 rounded-xl font-bold uppercase tracking-wide text-xs text-center transition-colors"
                    >
                      View Application
                    </Link>
                  ) : program.status === 'INTAKE' ? (
                    <Link
                      key="link-apply"
                      href={isLoggedIn 
                        ? (program.applyUrl || `/explore/gov-departments/${id}/programs/${programId}/apply`) 
                        : `/auth/login?callbackUrl=${encodeURIComponent(program.applyUrl ? `/explore/gov-departments/${id}/programs/${programId}` : `/explore/gov-departments/${id}/programs/${programId}/apply`)}`}
                      target={isLoggedIn && program.applyUrl ? "_blank" : undefined}
                      rel={isLoggedIn && program.applyUrl ? "noopener noreferrer" : undefined}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#F26522] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-[#F26522]/20 hover:scale-105 transition-all text-center"
                    >
                      Apply Now {isLoggedIn && program.applyUrl && <ArrowUpRight className="w-4 h-4" />}
                    </Link>
                  ) : (
                    <button key="btn-closed" disabled className="w-full sm:w-auto px-8 py-3 bg-muted text-muted-foreground rounded-full font-bold uppercase tracking-wide text-xs cursor-not-allowed text-center">
                      Closed
                    </button>
                  )}
                </div>
             </div>
          </div>

          {/* About Event */}
          <section className="space-y-4 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About the Program</h3>
            <div className="prose prose-sm sm:prose-base max-w-none text-[#1A1A2E]/80 whitespace-pre-wrap break-words">
              {program.description || "No description provided."}
            </div>
          </section>

          {/* Key Benefits */}
          {program.keyBenefits && Array.isArray(program.keyBenefits) && program.keyBenefits.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-muted/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Key Benefits</h3>
              <ul className="space-y-3">
                {program.keyBenefits.map((benefit: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full mt-2 shrink-0" />
                    <span className="text-sm sm:text-base font-medium text-[#1A1A2E]">
                      {benefit.title || benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {/* Timeline details (we have Dates above, but we can put deadline here) */}
          <section className="space-y-4 pt-6 border-t border-muted/40">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Important Dates</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Application Deadline</span>
                <span className="font-bold text-[#1A1A2E]">{formatDate(program.applicationDeadline)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Program Start Date</span>
                <span className="font-bold text-[#1A1A2E]">{formatDate(program.startDate)}</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
