"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  CheckSquare,
  List,
  Type,
  AlignLeft,
  Sparkles,
  Link2,
  Hash,
  Heading,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Badge, Input, Label } from "@onlystartups/ui";
import { toast } from "sonner";
import { updateProgram } from "@/actions/gov-department/programs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface Question {
  id: string;
  type: "TEXT" | "TEXTAREA" | "SELECT" | "CHECKBOX" | "URL" | "NUMBER" | "STATEMENT";
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: string[];
}

interface ProgramFormBuilderProps {
  programId: string;
  initialQuestions: Question[];
  onComplete: () => void;
  onBack: () => void;
}

export function ProgramFormBuilder({ programId, initialQuestions, onComplete, onBack }: ProgramFormBuilderProps) {
  const [isPending, startTransition] = useTransition();
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions && initialQuestions.length > 0 
    ? initialQuestions 
    : [
        {
          id: "q_init_1",
          type: "TEXT",
          label: "What is your startup name?",
          placeholder: "Acme Corp",
          description: "Enter your official company name or working title.",
          required: true,
        },
        {
          id: "q_init_2",
          type: "TEXTAREA",
          label: "Describe your product/mission in one paragraph.",
          placeholder: "We are building the future of...",
          description: "Summarize your product, target audience, and key value proposition.",
          required: true,
        },
      ]
  );

  const addQuestion = (type: Question["type"]) => {
    const newQ: Question = {
      // eslint-disable-next-line react-hooks/purity
      id: `q_${Date.now()}`,
      type,
      label: `New ${type.toLowerCase()} question`,
      placeholder: "",
      description: "",
      required: false,
      options: type === "SELECT" || type === "CHECKBOX" ? ["Option 1", "Option 2"] : undefined,
    };
    setQuestions((prev) => [...prev, newQ]);
    toast.success("Question added! Scroll down to edit.");
  };

  const addPresetQuestion = (presetKey: string) => {
    let preset: Question;
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    switch (presetKey) {
      case "PITCH":
        preset = { id: `q_preset_pitch_${now}`, type: "URL", label: "Pitch Deck URL", placeholder: "https://yourpitch.com/deck", description: "Please share a public or password-protected link to your pitch deck.", required: true };
        break;
      case "LINKEDIN":
        preset = { id: `q_preset_linkedin_${now}`, type: "URL", label: "Founder LinkedIn Profile", placeholder: "https://linkedin.com/in/username", description: "Provide a link to the primary founder's LinkedIn profile.", required: false };
        break;
      case "STAGE":
        preset = { id: `q_preset_stage_${now}`, type: "SELECT", label: "Current Startup Stage", options: ["Ideation / Pre-seed", "MVP / Prototype", "Early Traction", "Scaling / Growth"], description: "Select the stage that best describes your startup's current progress.", required: true };
        break;
      case "MRR":
        preset = { id: `q_preset_mrr_${now}`, type: "NUMBER", label: "Current Monthly Recurring Revenue (MRR)", placeholder: "e.g. 150000", description: "Enter your startup's average MRR in INR.", required: false };
        break;
      case "TEAM":
        preset = { id: `q_preset_team_${now}`, type: "NUMBER", label: "Total Team Size", placeholder: "e.g. 5", description: "Total number of founders and full-time employees.", required: false };
        break;
      default:
        return;
    }
    setQuestions((prev) => [...prev, preset]);
    toast.success(`Preset "${preset.label}" added!`);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.error("Question removed.");
  };

  const updateQuestion = (id: string, fields: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...fields } : q))
    );
  };

  const addOption = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId && q.options) {
          return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
        }
        return q;
      })
    );
  };

  const removeOption = (qId: string, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId && q.options) {
          return { ...q, options: q.options.filter((_, idx) => idx !== optIndex) };
        }
        return q;
      })
    );
  };

  const updateOption = (qId: string, optIndex: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId && q.options) {
          const newOpts = [...q.options];
          newOpts[optIndex] = val;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[swapIndex];
    newQuestions[swapIndex] = temp;
    setQuestions(newQuestions);
  };

  const handleSaveOnly = () => {
    const hasEmptyLabels = questions.some((q) => !q.label.trim());
    if (hasEmptyLabels) {
      toast.error("Please fill in question labels for all questions.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await updateProgram(programId, { applicationQuestions: questions });
        if (res.success) {
          toast.success("Form saved successfully!");
        } else {
          toast.error(res.error || "Failed to save form");
        }
      } catch (err) {
        toast.error("An error occurred while saving");
      }
    });
  };

  const handlePreview = () => {
    localStorage.setItem("temp_preview_questions", JSON.stringify(questions));
    window.open(`/gov-department/programs/${programId}/customize/preview`, "_blank");
  };

  const handleSaveAndContinue = () => {
    const hasEmptyLabels = questions.some((q) => !q.label.trim());
    if (hasEmptyLabels) {
      toast.error("Please fill in question labels for all questions.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await updateProgram(programId, { applicationQuestions: questions });
        if (res.success) {
          toast.success("Form saved successfully!");
          onComplete();
        } else {
          toast.error(res.error || "Failed to save form");
        }
      } catch (err) {
        toast.error("An error occurred while saving");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar: Form Outline & Presets */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white border border-muted/60 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A2E] flex items-center gap-2">
              <List className="w-3.5 h-3.5 text-primary" />
              Form Outline
            </h3>
            {questions.length === 0 ? (
              <div className="text-[10px] text-muted-foreground italic text-center py-6 border border-dashed rounded-xl">
                No fields defined yet.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const Icon =
                    q.type === "TEXT" ? Type
                      : q.type === "TEXTAREA" ? AlignLeft
                      : q.type === "SELECT" ? List
                      : q.type === "URL" ? Link2
                      : q.type === "NUMBER" ? Hash
                      : q.type === "STATEMENT" ? Heading
                      : CheckSquare;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        const el = document.getElementById(q.id);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className="w-full p-2 hover:bg-muted/30 rounded-lg text-left flex items-center gap-2 transition-all border border-transparent hover:border-muted/50"
                    >
                      <Icon className="w-3 h-3 text-primary/70 shrink-0" />
                      <span className="text-xs font-bold text-[#1A1A2E]/80 truncate flex-1">
                        {idx + 1}. {q.label || "Untitled Field"}
                      </span>
                      {q.required && (
                        <span className="text-[8px] font-black uppercase tracking-wider text-red-500 bg-red-50 px-1 rounded-sm">
                          Req
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="border-t border-muted/60 pt-3 flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase">
              <span>Required: {questions.filter((q) => q.required).length}</span>
              <span>Total: {questions.length}</span>
            </div>
          </div>

          <div className="bg-white border border-muted/60 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A2E] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Standard Presets
            </h3>
            <p className="text-[10px] font-medium text-muted-foreground leading-normal">
              Instantly add preset investor-ready startup questions into your form template.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { key: "PITCH", label: "Pitch Deck URL" },
                { key: "LINKEDIN", label: "Founder LinkedIn" },
                { key: "STAGE", label: "Startup Stage" },
                { key: "MRR", label: "Monthly MRR" },
                { key: "TEAM", label: "Team Size" },
              ].map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => addPresetQuestion(preset.key)}
                  className="w-full py-2.5 px-3.5 bg-[#F5F5EE]/40 hover:bg-primary/5 hover:text-primary rounded-xl border border-muted/40 hover:border-primary/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all text-left flex items-center justify-between"
                >
                  {preset.label}
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white border border-muted/60 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-muted/60 pb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#1A1A2E] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Form Questions Builder
              </h2>
              <Badge className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase px-2 py-0.5">
                {questions.length} Fields Defined
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Quick Add Question Field
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: "TEXT", label: "Short Answer", icon: Type },
                  { type: "TEXTAREA", label: "Paragraph", icon: AlignLeft },
                  { type: "SELECT", label: "Dropdown", icon: List },
                  { type: "CHECKBOX", label: "Checkboxes", icon: CheckSquare },
                  { type: "URL", label: "Link/URL", icon: Link2 },
                  { type: "NUMBER", label: "Number", icon: Hash },
                  { type: "STATEMENT", label: "Section", icon: Heading },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addQuestion(item.type as Question["type"])}
                    className="p-3 bg-[#F5F5EE]/40 hover:bg-primary/5 hover:text-primary rounded-xl border border-muted/60 hover:border-primary/20 text-xs font-bold text-muted-foreground flex flex-col items-center gap-1.5 transition-all text-center"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <AnimatePresence initial={false}>
              {questions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-16 text-center border-2 border-dashed border-muted rounded-2xl bg-white text-muted-foreground text-xs font-semibold flex flex-col items-center justify-center gap-3"
                >
                  <Sparkles className="w-8 h-8 text-muted-foreground/30 animate-pulse" />
                  No custom questions defined. Use the toolbar or left presets to get started.
                </motion.div>
              ) : (
                questions.map((q, index) => {
                  const typeColors: Record<string, string> = {
                    TEXT: "bg-blue-50 text-blue-700 border-blue-200/50",
                    TEXTAREA: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
                    SELECT: "bg-amber-50 text-amber-700 border-amber-200/50",
                    CHECKBOX: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
                    URL: "bg-cyan-50 text-cyan-700 border-cyan-200/50",
                    NUMBER: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/50",
                    STATEMENT: "bg-slate-100 text-slate-700 border-slate-300/50",
                  };
                  return (
                    <motion.div
                      key={q.id}
                      id={q.id}
                      layoutId={q.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-muted/60 p-6 rounded-xl space-y-4 relative group shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-muted/40 pb-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[9px] font-black uppercase tracking-wider border px-2.5 py-1 rounded-lg", typeColors[q.type])}>
                            Field {index + 1}: {q.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveQuestion(index, "up")} disabled={index === 0} className="p-1 hover:bg-muted/40 rounded text-muted-foreground disabled:opacity-30">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => moveQuestion(index, "down")} disabled={index === questions.length - 1} className="p-1 hover:bg-muted/40 rounded text-muted-foreground disabled:opacity-30">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => deleteQuestion(q.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#1A1A2E]/50">Question / Label</Label>
                            <Input value={q.label} onChange={(e) => updateQuestion(q.id, { label: e.target.value })} placeholder="e.g. What is your pre-seed valuation?" className="bg-white border-muted h-10 mt-1 text-xs font-semibold rounded-lg" />
                          </div>
                          <div>
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#1A1A2E]/50">Help Text / Description (Optional)</Label>
                            <Input value={q.description || ""} onChange={(e) => updateQuestion(q.id, { description: e.target.value })} placeholder="e.g. Add instructions, links, or visual cues..." className="bg-white border-muted h-10 mt-1 text-xs font-medium rounded-lg" />
                          </div>
                        </div>
                        {(q.type === "TEXT" || q.type === "TEXTAREA" || q.type === "URL" || q.type === "NUMBER") && (
                          <div>
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#1A1A2E]/50">Placeholder Text (Optional)</Label>
                            <Input value={q.placeholder || ""} onChange={(e) => updateQuestion(q.id, { placeholder: e.target.value })} placeholder="e.g. Type your answer here..." className="bg-white border-muted h-10 mt-1 text-xs font-medium rounded-lg" />
                          </div>
                        )}
                        {(q.type === "SELECT" || q.type === "CHECKBOX") && (
                          <div className="space-y-2 bg-[#F5F5EE]/30 p-4 rounded-xl border border-muted/40">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-[#1A1A2E]/50 flex items-center justify-between">
                              Options List
                              <button onClick={() => addOption(q.id)} className="text-[9px] text-primary font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                                <Plus className="w-3.5 h-3.5" /> Add Option
                              </button>
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options?.map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-1.5">
                                  <Input value={opt} onChange={(e) => updateOption(q.id, optIndex, e.target.value)} className="bg-white border-muted h-9 text-xs rounded-lg flex-1" />
                                  <button onClick={() => removeOption(q.id, optIndex)} disabled={q.options && q.options.length <= 1} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {q.type !== "STATEMENT" && (
                          <div className="flex items-center justify-end gap-3 pt-2 border-t border-muted/40">
                            <span className="text-xs font-bold text-[#1A1A2E]/70">Required field</span>
                            <button type="button" onClick={() => updateQuestion(q.id, { required: !q.required })} className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", q.required ? "bg-primary" : "bg-muted")}>
                              <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", q.required ? "translate-x-5" : "translate-x-0")} />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between pt-6 mt-4 border-t border-muted/40">
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-6 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePreview}
                className="h-12 px-6 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button
                type="button"
                onClick={handleSaveOnly}
                disabled={isPending}
                className="h-12 px-6 rounded-full border border-[#1A1A2E] text-[#1A1A2E] text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                type="button"
                onClick={handleSaveAndContinue}
                disabled={isPending}
                className="h-12 px-8 rounded-full bg-[#1A1A2E] text-white text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50 shadow-md"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
