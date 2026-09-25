"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { Input } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { getProgramById } from "@/actions/gov-department/programs";
import { useParams } from "next/navigation";

interface Question {
  id: string;
  type: "TEXT" | "TEXTAREA" | "SELECT" | "CHECKBOX" | "URL" | "NUMBER" | "STATEMENT";
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: string[];
}

export default function FormPreviewPage() {
  const params = useParams();
  const programId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchPreview = async () => {
      // Attempt to load unsaved custom questions from localStorage first
      const temp = localStorage.getItem("temp_preview_questions");
      if (temp) {
        try {
          setQuestions(JSON.parse(temp));
        } catch (e) {
          console.error("Error parsing preview questions:", e);
        }
      } else if (programId) {
        // Fallback to saved program questions
        try {
          const res = await getProgramById(programId as string);
          if (res && res.applicationQuestions) {
            setQuestions(res.applicationQuestions);
          }
        } catch (e) {}
      }
    };
    fetchPreview();
  }, [programId]);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleClose}
          className="text-xs font-black text-muted-foreground flex items-center gap-2 hover:text-[#1A1A2E] transition-colors tracking-widest uppercase w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Customizer
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-muted/60 pb-6 gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-md flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3 h-3" /> Form Preview Mode
            </span>
            <h1 className="text-2xl font-black text-[#1A1A2E] tracking-tight mt-2">
              Apply to Program
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Here is exactly what founders will see when applying to your hub.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="h-10 px-4 rounded-full border border-muted bg-white text-[#1A1A2E] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-muted/30 transition-all shadow-sm shrink-0"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* Form Fields Rendering */}
      <div className="max-w-3xl space-y-6">
        {questions.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center gap-3">
            <AlertCircle className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground font-semibold">
              This custom application form has no questions defined yet.
            </p>
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {questions.map((q) => (
              <div key={q.id} className="bg-white border border-muted/60 p-6 rounded-xl space-y-3 shadow-sm">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A2E]/60 flex items-center gap-1">
                    {q.label}
                    {q.required && <span className="text-red-500">*</span>}
                  </Label>
                  {q.description && (
                    <p className="text-[11px] text-muted-foreground font-medium leading-normal">
                      {q.description}
                    </p>
                  )}
                </div>

                {/* Statements don't have inputs */}
                {q.type !== "STATEMENT" && (
                  <>
                    {(q.type === "TEXT" || q.type === "URL" || q.type === "NUMBER") && (
                      <Input
                        type={q.type === "URL" ? "url" : q.type === "NUMBER" ? "number" : "text"}
                        placeholder={q.placeholder || "Type your response..."}
                        className="rounded-full border-[#1A1A2E]/20 text-xs font-semibold h-11 bg-white cursor-not-allowed"
                        disabled
                      />
                    )}

                    {q.type === "TEXTAREA" && (
                      <textarea
                        placeholder={q.placeholder || "Describe details..."}
                        className="w-full rounded-xl border border-[#1A1A2E]/20 bg-white p-3 text-xs font-semibold outline-none min-h-[100px] resize-none cursor-not-allowed"
                        disabled
                      />
                    )}

                    {q.type === "SELECT" && (
                      <div className="relative">
                        <select
                          className="w-full bg-white border border-[#1A1A2E]/20 rounded-xl h-11 px-3 text-xs font-semibold outline-none appearance-none cursor-not-allowed"
                          disabled
                        >
                          <option value="">Select option...</option>
                          {q.options?.map((o, idx) => (
                            <option key={idx} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {q.type === "CHECKBOX" && (
                      <div className="space-y-2 pl-1">
                        {q.options?.map((o, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground select-none cursor-not-allowed"
                          >
                            <input
                              type="checkbox"
                              disabled
                              className="rounded border-[#1A1A2E]/20 accent-[#F26522] cursor-not-allowed"
                            />
                            {o}
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <button
              disabled
              className="w-full h-12 mt-4 bg-[#1A1A2E] text-white rounded-full text-xs font-black uppercase tracking-widest opacity-80 flex items-center justify-center gap-2 cursor-not-allowed shadow-md"
            >
              Submit Application (Preview Only)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
