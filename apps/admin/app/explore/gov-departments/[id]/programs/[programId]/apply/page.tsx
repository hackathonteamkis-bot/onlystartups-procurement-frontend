"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";
import { applyToProgram } from "@/actions/explore/apply";
import { getProgramByIdPublic } from "@/actions/explore";
import { trackAnalytics } from "@/actions/dashboard/analytics";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input, Label, useBreadcrumbContext } from "@onlystartups/ui";

interface Question {
  id: string;
  type: "TEXT" | "TEXTAREA" | "SELECT" | "CHECKBOX" | "URL" | "NUMBER" | "STATEMENT";
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: string[];
}

export default function ProgramApplyPage(props: { params: Promise<{ id: string, programId: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const { data: session } = useSession();
  const { setBreadcrumb } = useBreadcrumbContext();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [programName, setProgramName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  
  // Fallback states for when there are no custom questions
  const [message, setMessage] = useState("");
  const [pitchUrl, setPitchUrl] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await getProgramByIdPublic(params.programId);
        if (!res || "error" in res) {
          toast.error("Program not found.");
          router.push("/explore/programs");
        } else if (res.applyUrl) {
          window.location.replace(res.applyUrl);
        } else {
          setProgramName(res.name);
          setBreadcrumb(params.id, res.govDepartment?.startupName || res.govDepartment?.name || params.id);
          setBreadcrumb(params.programId, res.name);

          if (res.isApplied) {
            setIsApplied(true);
            setApplicationData(res.application);
          }

          if (res.applicationQuestions && Array.isArray(res.applicationQuestions)) {
            setQuestions(res.applicationQuestions);
            
            // Initialize answers
            const initialAnswers: Record<string, any> = {};
            res.applicationQuestions.forEach((q: Question) => {
              if (q.type === "CHECKBOX") {
                initialAnswers[q.id] = [];
              } else if (q.type !== "STATEMENT") {
                initialAnswers[q.id] = "";
              }
     
            });
            setAnswers(initialAnswers);
          }
        }
      } catch (err) {
        console.error("Error loading program:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.programId && session?.user) {
      void fetchProgram();
      void trackAnalytics("FORM_VIEW", "program_application", params.id, { programId: params.programId });
    }
  }, [params.programId, session, params.id, router, setBreadcrumb]);

  useEffect(() => {
    if (inputRef.current && !loading && questions.length === 0) {
      inputRef.current.focus();
    }
     
  }, [loading, questions]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter((o: string) => o !== option) };
      }
     
    });
  };

  const handleNext = () => {
    const q = questions[currentStep];
    if (q.required && q.type !== "STATEMENT") {
      const val = answers[q.id];
      if (!val || (Array.isArray(val) && val.length === 0)) {
        toast.error(`Please provide an answer to proceed.`);
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent early submission if user presses Enter on an earlier step
    if (questions.length > 0 && currentStep < questions.length - 1) {
      handleNext();
      return;
    }
    
    // Final validation
    if (questions.length > 0) {
      const q = questions[currentStep];
      if (q.required && q.type !== "STATEMENT") {
        const val = answers[q.id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          toast.error(`Please provide an answer to submit.`);
          return;
        }
      }
    } else {
      if (!message.trim()) {
        toast.error("Cover letter/message is required.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await applyToProgram({
        programId: params.programId,
        govDepartmentId: params.id,
        message: questions.length === 0 ? message : undefined,
        pitchUrl: questions.length === 0 ? pitchUrl : undefined,
        answers: questions.length > 0 ? answers : undefined,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
        void trackAnalytics("FORM_SUBMIT", "program_application", params.id, { programId: params.programId });
        setTimeout(() => {
          router.push(`/explore/gov-departments/${params.id}/programs/${params.programId}`);
        }, 2500);
      }
    } catch (err) {
      toast.error("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground font-semibold">Loading form...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <CheckCircle2 className="w-16 h-16 text-emerald-500" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A2E] tracking-tight">Application Submitted!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-normal">
            Your application for <strong>{programName}</strong> has been received. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  const isLastStep = questions.length > 0 && currentStep === questions.length - 1;
  const currentQ = questions[currentStep];

  // Check if current question is required and empty to disable Next button
  const isCurrentRequiredAndEmpty = currentQ?.required && currentQ.type !== "STATEMENT" && (!answers[currentQ.id] || (Array.isArray(answers[currentQ.id]) && answers[currentQ.id].length === 0));

  return (
    <div className="space-y-6 pb-20 min-h-[80dvh] flex flex-col justify-between w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Progress Navigator */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest">
          <Link
            href={`/explore/gov-departments/${params.id}/programs/${params.programId}`}
            className="flex items-center gap-2 hover:text-[#1A1A2E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isApplied ? "Back to Program" : "Cancel Application"}</span>
            <span className="sm:hidden">{isApplied ? "Back" : "Cancel"}</span>
          </Link>
          <span>
            {isApplied 
              ? "Your Application" 
              : questions.length > 0
              ? `Step ${currentStep + 1} of ${questions.length}`
              : "Application Form"}
          </span>
        </div>
        {!isApplied && (
          <div className="w-full bg-black/10 h-2 sm:h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-[#F26522] h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  questions.length > 0
                    ? `${((currentStep + 1) / questions.length) * 100}%`
                    : "100%",
              }}
            />
          </div>
        )}
      </div>

      {isApplied && applicationData ? (
        <div className="flex-1 flex flex-col items-center py-6 sm:py-10 space-y-8 w-full max-w-full mx-auto px-2">
          <div className="space-y-2 text-center w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight leading-snug">
              Your Application
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
              You have already submitted an application for {programName}.
            </p>
          </div>
          
          <div className="w-full space-y-6">
            {questions.length === 0 ? (
              <div className="space-y-6 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 rounded-2xl w-full">
                {applicationData.pitchUrl && (
                  <div className="space-y-2 w-full overflow-hidden">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Pitch Deck URL</Label>
                    <div className="p-4 bg-white/50 border border-white/60 rounded-xl">
                      <a href={applicationData.pitchUrl} target="_blank" rel="noopener noreferrer" className="text-[#F26522] hover:underline font-medium break-all">
                        {applicationData.pitchUrl}
                      </a>
                    </div>
                  </div>
                )}
                {applicationData.message && (
                  <div className="space-y-2 w-full overflow-hidden">
                    <Label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Cover Letter</Label>
                    <div className="p-4 bg-white/50 border border-white/60 rounded-xl text-[#1A1A2E] whitespace-pre-wrap break-words font-medium">
                      {applicationData.message}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 rounded-2xl w-full">
                {questions.map((q, idx) => {
                  const ans = applicationData.answers?.[q.id];
                  return (
                    <div key={q.id} className="space-y-2 pb-6 border-b border-muted/30 last:border-0 last:pb-0 w-full overflow-hidden">
                      <Label className="text-base sm:text-lg font-black text-[#1A1A2E] leading-snug">
                        {idx + 1}. {q.label}
                      </Label>
                      <div className="mt-2 text-[#1A1A2E] font-medium text-sm sm:text-base whitespace-pre-wrap break-all sm:break-words bg-white/50 p-4 rounded-xl border border-white/60">
                        {Array.isArray(ans) ? ans.join(", ") : ans || "No answer provided"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col items-center py-6 sm:py-10 space-y-8 w-full max-w-2xl mx-auto">
        
        <div className="space-y-2 text-center w-full px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight leading-snug">
            Program Application
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
            Please fill out the following questions to apply for {programName}.
          </p>
        </div>

        <div className="space-y-6 w-full px-2">
          {questions.length === 0 ? (
            <>
              {/* Fallback Form when no custom questions exist */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Pitch Deck URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://pitch.com/deck..."
                    value={pitchUrl}
                    onChange={(e) => setPitchUrl(e.target.value)}
                    className="w-full h-12 sm:h-14 border border-muted-foreground/30 focus:border-[#F26522]/50 outline-none rounded-xl px-4 sm:px-5 text-sm sm:text-base bg-white shadow-sm transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-widest flex gap-1">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    ref={inputRef}
                    required
                    placeholder="Tell us about your startup, your goals, and why you want to join this program..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-40 sm:h-56 border border-muted-foreground/30 focus:border-[#F26522]/50 outline-none rounded-xl p-4 sm:p-5 text-sm sm:text-base resize-none bg-white shadow-sm transition-colors"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-start text-left w-full mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 w-full"
                >
                  <div className="space-y-2">
                    <Label className="text-base sm:text-lg md:text-xl font-black text-[#1A1A2E] flex items-start gap-1.5 leading-snug">
                      {currentQ.label}
                      {currentQ.required && <span className="text-red-500 mt-1">*</span>}
                    </Label>
                    {currentQ.description && (
                      <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                        {currentQ.description}
                      </p>
                    )}
                  </div>

                  {currentQ.type !== "STATEMENT" && (
                    <div className="pt-2 w-full">
                      {(currentQ.type === "TEXT" || currentQ.type === "URL" || currentQ.type === "NUMBER") && (
                        <Input
                          type={currentQ.type === "URL" ? "url" : currentQ.type === "NUMBER" ? "number" : "text"}
                          placeholder={currentQ.placeholder || "Type your response..."}
                          value={answers[currentQ.id] || ""}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="w-full rounded-xl border-[#1A1A2E]/20 text-sm sm:text-base font-semibold h-12 sm:h-14 bg-white focus:border-[#F26522] focus:ring-[#F26522]/20"
                          autoFocus
                        />
                      )}

                      {currentQ.type === "TEXTAREA" && (
                        <textarea
                          placeholder={currentQ.placeholder || "Describe details..."}
                          value={answers[currentQ.id] || ""}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="w-full rounded-xl border border-[#1A1A2E]/20 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20 bg-white p-4 sm:p-5 text-sm sm:text-base font-semibold outline-none min-h-[160px] sm:min-h-[200px] resize-y transition-all shadow-sm"
                          autoFocus
                        />
                      )}

                      {currentQ.type === "SELECT" && (
                        <div className="relative w-full">
                          <select
                            value={answers[currentQ.id] || ""}
                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                            className="w-full bg-white border border-[#1A1A2E]/20 focus:border-[#F26522] focus:ring-2 focus:ring-[#F26522]/20 rounded-xl h-12 sm:h-14 px-4 sm:px-5 text-sm sm:text-base font-semibold outline-none appearance-none shadow-sm transition-all"
                          >
                            <option value="" disabled>Select an option...</option>
                            {currentQ.options?.map((o, idx) => (
                              <option key={idx} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {currentQ.type === "CHECKBOX" && (
                        <div className="space-y-3 sm:space-y-4 pl-1 pt-2">
                          {currentQ.options?.map((o, idx) => {
                            const isChecked = Array.isArray(answers[currentQ.id]) && answers[currentQ.id].includes(o);
                            return (
                              <label
                                key={idx}
                                className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-semibold text-[#1A1A2E] select-none cursor-pointer group p-2 sm:p-3 hover:bg-muted/30 rounded-xl transition-colors -ml-2 sm:-ml-3"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => handleCheckboxChange(currentQ.id, o, e.target.checked)}
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded border-[#1A1A2E]/20 text-[#F26522] focus:ring-[#F26522] transition-all cursor-pointer group-hover:border-[#F26522]"
                                />
                                <span>{o}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Action Buttons at bottom */}
        <div className="border-t border-muted/60 pt-6 mt-8 flex flex-col-reverse sm:flex-row items-center justify-between w-full gap-4 px-2">
          {questions.length > 0 ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0 || submitting}
                className={`w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full border border-muted bg-white text-[#1A1A2E] text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-muted/30 hover:shadow-sm"
                }`}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Previous
              </button>

              {isLastStep ? (
                <button
                  type="submit"
                  disabled={submitting || isCurrentRequiredAndEmpty}
                  className={`w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-[#F26522] text-white text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    submitting || isCurrentRequiredAndEmpty ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:shadow-[#F26522]/20 hover:brightness-110"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isCurrentRequiredAndEmpty}
                  className={`w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-[#1A1A2E] text-white text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    isCurrentRequiredAndEmpty ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:brightness-110"
                  }`}
                >
                  Next
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className={`w-full sm:w-auto h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-[#F26522] text-white text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 ml-auto`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
      )}
    </div>
  );
}
