"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProgramById, createProgram, updateProgram } from "@/actions/startup-hub/programs";
import { getSignedUploadUrl } from "@/actions/user/storage";
import { supabase } from "@/lib/supabase";
import { ProgramFormBuilder, Question } from "@/components/startup-hub/program-form-builder";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Label, Textarea } from "@onlystartups/ui";
import { Loader2, ArrowRight, ArrowLeft, Rocket, FileText, CheckCircle2, Circle, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";

function WizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("id");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(!!programId);
  const [saving, setSaving] = useState(false);

  // Program State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [keyBenefits, setKeyBenefits] = useState<string[]>([""]);
  
  const [programDuration, setProgramDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicationOpens, setApplicationOpens] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [applyUrl, setApplyUrl] = useState("");
  const [applicationMode, setApplicationMode] = useState<"internal" | "external">("internal");

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (startDate && programDuration && programDuration !== "Custom") {
      const start = new Date(startDate);
      const end = new Date(start);

      if (programDuration === "4 Weeks") end.setDate(end.getDate() + 28);
      else if (programDuration === "8 Weeks") end.setDate(end.getDate() + 56);
      else if (programDuration === "12 Weeks") end.setDate(end.getDate() + 84);
      else if (programDuration === "6 Months") end.setMonth(end.getMonth() + 6);
      
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate, programDuration]);

  useEffect(() => {
    if (programId) {
      const fetchDraft = async () => {
        try {
          const res = await getProgramById(programId);
          if (res && !res.error) {
            setName(res.name || "");
            setDescription(res.description || "");
            setThumbnail(res.thumbnail || "");
            setKeyBenefits(res.keyBenefits || [""]);
            setProgramDuration(res.programDuration || "");
            setStartDate(res.startDate ? new Date(res.startDate).toISOString().split('T')[0] : "");
            setEndDate(res.endDate ? new Date(res.endDate).toISOString().split('T')[0] : "");
            setApplicationOpens(res.applicationOpens ? new Date(res.applicationOpens).toISOString().split('T')[0] : "");
            setApplicationDeadline(res.applicationDeadline ? new Date(res.applicationDeadline).toISOString().split('T')[0] : "");
            setQuestions(res.applicationQuestions || []);
            setApplyUrl(res.applyUrl || "");
            setApplicationMode(res.applyUrl ? "external" : "internal");
          }
        } catch (e) {
          toast.error("Failed to load program draft");
        } finally {
          setLoading(false);
        }
      };

      fetchDraft();

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') fetchDraft();
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [programId]);

  const handleNextStep1 = async () => {
    if (!name) return toast.error("Program Name is required.");
    setSaving(true);
    try {
      const payload = {
        name,
        description,
        thumbnail,
        keyBenefits: keyBenefits.filter(b => b.trim() !== ""),
      };
      if (programId) {
        await updateProgram(programId, payload);
        setStep(2);
      } else {
        const res = await createProgram(payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          router.replace(`/startup-hub/programs/new?id=${res.data.id}`);
          setStep(2);
        }
      }
    } catch (e) {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep2 = async () => {
    if (!programId) return;
    
    if (!programDuration || !startDate || !endDate || !applicationOpens || !applicationDeadline) {
      return toast.error("All timeline and scheduling fields are required.");
    }

    if (new Date(endDate) < new Date(startDate)) return toast.error("Program End Date must be after the Start Date.");
    if (new Date(applicationDeadline) < new Date(applicationOpens)) return toast.error("Application Deadline must be after the Opens date.");

    setSaving(true);
    try {
      await updateProgram(programId, {
        programDuration,
        startDate,
        endDate,
        applicationOpens,
        applicationDeadline,
      });
      setStep(3);
    } catch (e) {
      toast.error("Failed to save timelines");
    } finally {
      setSaving(false);
    }
  };

  const handleNextStep3External = async () => {
    if (!programId) return;
    if (!applyUrl.trim()) return toast.error("Please provide an external application link.");
    setSaving(true);
    try {
      await updateProgram(programId, { applyUrl, applicationQuestions: null });
      setStep(4);
    } catch (e) {
      toast.error("Failed to save external link");
    } finally {
      setSaving(false);
    }
  };

  const handleLaunch = async () => {
    if (!programId) return;
    setSaving(true);
    try {
      await updateProgram(programId, { status: "INTAKE" });
      toast.success("Program officially launched!");
      router.push(`/startup-hub/programs/${programId}`);
    } catch (e) {
      toast.error("Failed to launch program");
    } finally {
      setSaving(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setThumbnail(objectUrl);

    if (file.size > 2 * 1024 * 1024) return toast.error("Thumbnail must be less than 2MB");

    const toastId = toast.loading("Uploading thumbnail...");
    try {
      const authRes = await fetch("/api/auth/session");
      const session = await authRes.json();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${session.user.id}/programs/${fileName}`;

      const signedRes = await getSignedUploadUrl(filePath);
      if (signedRes.error || !signedRes.signedUrl || !signedRes.token) {
        throw new Error(signedRes.error || "Failed to get signed URL");
      }

      
      let fileToUpload = file;
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
        fileToUpload = await imageCompression(file, options);
      } catch (e) { console.warn("Compression failed", e); }

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .uploadToSignedUrl(filePath, signedRes.token, fileToUpload);


      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setThumbnail(publicUrl);
      toast.success("Thumbnail uploaded successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload thumbnail", { id: toastId });
    }
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#1A1A2E]" /></div>;
  }

  const steps = [
    { id: 1, title: "Profile", description: "Identity & info" },
    { id: 2, title: "Timeline", description: "Dates & schedules" },
    { id: 3, title: "Form", description: "Intake questions" },
    { id: 4, title: "Launch", description: "Review & publish" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-6 px-4 md:px-0 transition-all duration-300">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <Link href="/startup-hub/programs" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> BACK TO PROGRAMS
          </Link>
          <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight">Deploy Program</h1>
          <p className="text-muted-foreground text-sm font-medium">Complete all steps to launch your new batch.</p>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium overflow-x-auto pb-2 md:pb-0">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <span className={cn("transition-colors", step === s.id ? "text-primary font-bold" : step > s.id ? "text-gray-900" : "text-muted-foreground")}>
                {s.id}. {s.title}
              </span>
              {i < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-border relative overflow-hidden">
        <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-black text-[#1A1A2E] mb-2">Profile & Positioning</h2>
                  <p className="text-gray-500 text-sm font-medium">Define the identity and foundational text for this specific batch.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Program Name</Label>
                    <Input className="bg-gray-50/50 border-gray-200 rounded-xl h-12 focus-visible:ring-[#F26522]/20 focus-visible:border-[#F26522]" required placeholder="e.g. DeepTech Accelerator - Batch 3" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</Label>
                    <Textarea className="bg-gray-50/50 border-gray-200 rounded-xl resize-none focus-visible:ring-[#F26522]/20 focus-visible:border-[#F26522]" rows={5} placeholder="Detailing the focus, vertical, and core objective..." value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Program Thumbnail</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      {thumbnail ? (
                        <div className="w-64 h-36 rounded-2xl overflow-hidden border-2 border-gray-100 relative group shrink-0 shadow-sm transition-all hover:border-[#F26522]/30" style={{ aspectRatio: '16/9' }}>
                          <Image src={thumbnail} alt="Program Thumbnail" fill unoptimized className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-[#1A1A2E]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                            <label className="cursor-pointer text-white text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                              Change
                              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="w-64 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#F26522]/50 hover:bg-[#F26522]/5 transition-all shrink-0 bg-gray-50" style={{ aspectRatio: '16/9' }}>
                          <FileText className="w-8 h-8 text-gray-300 mb-2" />
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upload Cover</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                        </label>
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-gray-700">16:9 Landscape Image</p>
                        <p className="text-xs text-gray-500 font-medium">JPEG or PNG. Max size: 2MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Key Benefits</Label>
                    <div className="space-y-3">
                      {keyBenefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Input className="bg-gray-50/50 border-gray-200 rounded-xl h-11 focus-visible:ring-[#F26522]/20 focus-visible:border-[#F26522]" placeholder="e.g. ₹10k Equity-free Grant" value={benefit} onChange={(e) => {
                            const newB = [...keyBenefits]; newB[i] = e.target.value; setKeyBenefits(newB);
                          }} />
                          <Button variant="ghost" size="icon" onClick={() => setKeyBenefits(keyBenefits.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0">
                            &times;
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => setKeyBenefits([...keyBenefits, ""])} className="rounded-xl border-dashed border-gray-300 text-gray-500 hover:text-[#F26522] hover:border-[#F26522] hover:bg-[#F26522]/5 w-full">
                        + Add Another Benefit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                  <Button onClick={handleNextStep1} disabled={saving} size="lg" className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white rounded-xl px-8 font-semibold group">
                    {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Save & Continue"} 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-black text-[#1A1A2E] mb-2">Timeline & Scheduling</h2>
                  <p className="text-gray-500 text-sm font-medium">Set the boundaries and operational dates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                       <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><CalendarIcon className="w-4 h-4 text-blue-600" /></div>
                       <h3 className="font-bold text-gray-900">Program Dates</h3>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Duration</Label>
                      <select 
                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]/20 focus-visible:border-[#F26522]"
                        value={programDuration} onChange={(e) => setProgramDuration(e.target.value)}
                      >
                        <option value="">Select duration...</option>
                        <option value="4 Weeks">4 Weeks</option>
                        <option value="8 Weeks">8 Weeks</option>
                        <option value="12 Weeks">12 Weeks</option>
                        <option value="6 Months">6 Months</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</Label>
                      <Input className="h-12 rounded-xl bg-gray-50/50" type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">End Date (Demo Day)</Label>
                      <Input className="h-12 rounded-xl bg-gray-50/50" type="date" min={today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                       <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center"><Rocket className="w-4 h-4 text-orange-600" /></div>
                       <h3 className="font-bold text-gray-900">Application Window</h3>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Applications Open</Label>
                      <Input className="h-12 rounded-xl bg-gray-50/50" type="date" min={today} value={applicationOpens} onChange={(e) => setApplicationOpens(e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deadline</Label>
                      <Input className="h-12 rounded-xl bg-gray-50/50" type="date" min={today} value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500 rounded-xl">Back to Profile</Button>
                  <Button onClick={handleNextStep2} disabled={saving} size="lg" className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white rounded-xl px-8 font-semibold group">
                    {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Save Timelines"} 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-[#1A1A2E] mb-2">Application Form</h2>
                    <p className="text-sm text-gray-500 font-medium">Design the custom intake form for startups applying to this program, or link to an external one.</p>
                  </div>
                  
                  <div className="flex bg-gray-100 p-1 rounded-xl w-fit shrink-0">
                    <button
                      onClick={() => setApplicationMode("internal")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                        applicationMode === "internal" ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500 hover:text-[#1A1A2E]"
                      )}
                    >
                      Custom Form
                    </button>
                    <button
                      onClick={() => setApplicationMode("external")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                        applicationMode === "external" ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500 hover:text-[#1A1A2E]"
                      )}
                    >
                      External Link
                    </button>
                  </div>
                </div>

                {applicationMode === "internal" ? (
                  <ProgramFormBuilder 
                    programId={programId as string}
                    initialQuestions={questions as Question[]}
                    onComplete={() => {
                      updateProgram(programId as string, { applyUrl: null }).then(() => setStep(4));
                    }}
                    onBack={() => setStep(2)}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">External Application URL</Label>
                      <Input 
                        type="url"
                        className="bg-gray-50/50 border-gray-200 rounded-xl h-12 focus-visible:ring-[#F26522]/20 focus-visible:border-[#F26522]" 
                        required 
                        placeholder="https://docs.google.com/forms/..." 
                        value={applyUrl} 
                        onChange={(e) => setApplyUrl(e.target.value)} 
                      />
                      <p className="text-xs text-gray-500 font-medium mt-2">
                        Startups clicking &quot;Apply Now&quot; will be redirected to this link. We will not be able to track their application status natively.
                      </p>
                    </div>

                    <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
                      <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-500 rounded-xl">Back to Timelines</Button>
                      <Button onClick={handleNextStep3External} disabled={saving} size="lg" className="bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white rounded-xl px-8 font-semibold group">
                        {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Save & Continue"} 
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center pt-8"
              >
                <div className="space-y-6 max-w-lg mx-auto">
                  <div className="relative mx-auto w-32 h-32">
                     <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                     <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20">
                        <Rocket className="w-12 h-12 text-white" />
                     </div>
                  </div>
                  
                  <div>
                    <h2 className="text-4xl font-black text-[#1A1A2E] mb-4">Ready for Launch!</h2>
                    <p className="text-gray-500 text-lg leading-relaxed">
                      Your program <strong className="text-[#1A1A2E]">{name}</strong> is completely set up. Clicking Launch will change the status from DRAFT to INTAKE and generate your unique application URL.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                    <Button variant="ghost" onClick={() => setStep(3)} className="text-gray-500 rounded-xl px-6 h-12 w-full sm:w-auto">Review Form</Button>
                    <Button onClick={handleLaunch} disabled={saving} size="lg" className="bg-[#F26522] hover:bg-[#E55512] text-white text-lg px-10 h-14 rounded-xl shadow-xl shadow-[#F26522]/20 transition-all hover:scale-105 w-full sm:w-auto">
                      {saving ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : "Publish & Launch!"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProgramWizardPage() {
  return (
    <Suspense fallback={<div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#1A1A2E]" /></div>}>
      <WizardContent />
    </Suspense>
  );
}
