"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Textarea } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { createIssueAction } from "@/actions/fix-this";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, X } from "lucide-react";
import { Badge } from "@onlystartups/ui";

interface CreateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateIssueDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateIssueDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    coreFriction: "",
    targetDemographic: "",
    manualWorkarounds: "",
    rawTags: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const addTags = (input: string) => {
    const newTags = input
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !tags.includes(t));

    if (newTags.length > 0) {
      setTags((prev) => [...prev, ...newTags]);
    }
    setTagInput("");
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTags(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleTagInputBlur = () => {
    if (tagInput.trim()) {
      addTags(tagInput);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.title.trim()) {
      toast.error("Please enter a problem title.");
      return;
    }
    if (step === 2 && !formData.coreFriction.trim()) {
      toast.error("Please describe the problem.");
      return;
    }
    if (step === 3 && !formData.targetDemographic.trim()) {
      toast.error("Please specify who faces this problem.");
      return;
    }
    if (step === 4 && !formData.manualWorkarounds.trim()) {
      toast.error("Please specify the current workaround.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.coreFriction || !formData.targetDemographic || !formData.manualWorkarounds) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);

    // Parse tags including any uncommitted typing
    let finalTags = [...tags];
    if (tagInput.trim()) {
      const parsed = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && !finalTags.includes(t));
      finalTags = [...finalTags, ...parsed];
    }

    try {
      await createIssueAction({
        title: formData.title,
        coreFriction: formData.coreFriction,
        targetDemographic: formData.targetDemographic,
        manualWorkarounds: formData.manualWorkarounds,
        tags: finalTags,
      });

      toast.success("Problem posted successfully!");
      setFormData({
        title: "",
        coreFriction: "",
        targetDemographic: "",
        manualWorkarounds: "",
        rawTags: "",
      });
      setTags([]);
      setTagInput("");
      setStep(1);
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to post problem");
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if Next is disabled
  const isNextDisabled = () => {
    if (step === 1) return !formData.title.trim();
    if (step === 2) return !formData.coreFriction.trim();
    if (step === 3) return !formData.targetDemographic.trim();
    if (step === 4) return !formData.manualWorkarounds.trim();
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        setStep(1); // Reset step on close
      }
      onOpenChange(val);
    }}>
      <DialogContent className="w-[92%] sm:w-full max-w-xl bg-[#F5F5EE] border-[#1A1A2E]/10 p-5 sm:p-8 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold font-sans text-[#1A1A2E] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              Share a <span className="font-serif font-normal italic text-[#F26522]">Problem</span>
            </span>
            <span className="text-xs font-mono font-semibold bg-[#1A1A2E]/5 text-[#1A1A2E]/50 px-2 py-1 rounded-lg">
              Step {step} of 5
            </span>
          </DialogTitle>
          {/* Progress Bar */}
          <div className="w-full bg-[#1A1A2E]/5 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#F26522] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6 mt-4 relative min-h-[260px] flex flex-col justify-between">
          <div className="flex-1 flex flex-col justify-center overflow-hidden py-1">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <Label htmlFor="title" className="text-sm font-bold text-[#1A1A2E]">
                    Problem Title <span className="text-[#F26522]">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Give your problem a clear, concise title..."
                    value={formData.title}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength={100}
                    className="bg-white border-[#1A1A2E]/10 focus:border-[#F26522] rounded-full px-4 py-2.5 text-sm text-[#1A1A2E]"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#1A1A2E]/50">A short headline that summarizes the problem.</p>
                    <span className={`text-[10px] font-mono font-medium shrink-0 ml-2 ${formData.title.length >= 80 ? 'text-[#F26522]' : 'text-[#1A1A2E]/30'}`}>
                      {formData.title.length}/100
                    </span>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <Label htmlFor="coreFriction" className="text-sm font-bold text-[#1A1A2E]">
                    Describe the problem <span className="text-[#F26522]">*</span>
                  </Label>
                  <Textarea
                    id="coreFriction"
                    name="coreFriction"
                    placeholder="Describe the main struggle, tool limitation, or daily work friction in detail..."
                    value={formData.coreFriction}
                    onChange={handleChange}
                    disabled={loading}
                    rows={5}
                    maxLength={500}
                    className="bg-white border-[#1A1A2E]/10 focus:border-[#F26522] rounded-xl px-4 py-2 text-sm text-[#1A1A2E] resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end">
                    <span className={`text-[10px] font-mono font-medium ${formData.coreFriction.length >= 450 ? 'text-[#F26522]' : 'text-[#1A1A2E]/30'}`}>
                      {formData.coreFriction.length}/500
                    </span>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <Label htmlFor="targetDemographic" className="text-sm font-bold text-[#1A1A2E]">
                    Who faces this? <span className="text-[#F26522]">*</span>
                  </Label>
                  <Input
                    id="targetDemographic"
                    name="targetDemographic"
                    placeholder="e.g. Local retailers, sales teams, logistics coordinators, or small business owners..."
                    value={formData.targetDemographic}
                    onChange={handleChange}
                    disabled={loading}
                    maxLength={150}
                    className="bg-white border-[#1A1A2E]/10 focus:border-[#F26522] rounded-full px-4 py-2.5 text-sm text-[#1A1A2E]"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#1A1A2E]/50">Specify the target demographic, business type, or department experiencing this pain point.</p>
                    <span className={`text-[10px] font-mono font-medium shrink-0 ml-2 ${formData.targetDemographic.length >= 130 ? 'text-[#F26522]' : 'text-[#1A1A2E]/30'}`}>
                      {formData.targetDemographic.length}/150
                    </span>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <Label htmlFor="manualWorkarounds" className="text-sm font-bold text-[#1A1A2E]">
                    What is the current workaround? <span className="text-[#F26522]">*</span>
                  </Label>
                  <Textarea
                    id="manualWorkarounds"
                    name="manualWorkarounds"
                    placeholder="Describe how people cope today (e.g. spreadsheets, manual calculations, extra staff, hiring coordinators)..."
                    value={formData.manualWorkarounds}
                    onChange={handleChange}
                    disabled={loading}
                    rows={5}
                    maxLength={150}
                    className="bg-white border-[#1A1A2E]/10 focus:border-[#F26522] rounded-xl px-4 py-2 text-sm text-[#1A1A2E] resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end">
                    <span className={`text-[10px] font-mono font-medium ${formData.manualWorkarounds.length >= 130 ? 'text-[#F26522]' : 'text-[#1A1A2E]/30'}`}>
                      {formData.manualWorkarounds.length}/150
                    </span>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2.5"
                >
                  <Label htmlFor="tagInput" className="text-sm font-bold text-[#1A1A2E]">
                    Tags (Press Enter or Comma to add)
                  </Label>
                  <div className="flex flex-wrap gap-2 p-2 bg-white border border-[#1A1A2E]/10 focus-within:border-[#F26522] focus-within:ring-2 focus-within:ring-[#F26522]/20 rounded-xl min-h-[46px] transition-all items-center">
                    {tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-[#1A1A2E]/5 text-[#1A1A2E]/80 border-transparent rounded-lg pl-2.5 pr-1.5 py-0.5 flex items-center gap-1 text-xs font-semibold"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-[#1A1A2E]/10 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer"
                        >
                          <X className="w-3 h-3 text-[#1A1A2E]/50" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      id="tagInput"
                      placeholder={tags.length === 0 ? "e.g. Retail, Logistics, Marketing..." : "Add tag..."}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      onBlur={handleTagInputBlur}
                      disabled={loading}
                      className="flex-grow bg-transparent border-0 outline-none p-1 text-sm text-[#1A1A2E] min-w-[140px] focus:ring-0"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="pt-4 border-t border-[#1A1A2E]/5 flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 sm:gap-0">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center w-full gap-3">
              {/* Back and Cancel (mobile) container */}
              <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                {step > 1 ? (
                  <Button
                    key="back-btn"
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={handleBack}
                    className="flex-1 sm:flex-initial border-[#1A1A2E]/10 text-[#1A1A2E]/60 hover:bg-[#1A1A2E]/5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </Button>
                ) : (
                  <div className="flex-1 sm:hidden" />
                )}
                
                <Button
                  key="cancel-mob-btn"
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    setStep(1);
                    onOpenChange(false);
                  }}
                  className="flex-1 sm:hidden border-[#1A1A2E]/10 text-[#1A1A2E]/40 hover:text-[#1A1A2E]/60 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </Button>
              </div>

              {/* Right / desktop actions container */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
                <Button
                  key="cancel-desk-btn"
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    setStep(1);
                    onOpenChange(false);
                  }}
                  className="hidden sm:inline-flex border-transparent text-[#1A1A2E]/40 hover:text-[#1A1A2E]/60 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </Button>
                
                {step < 5 ? (
                  <Button
                    key="next-btn"
                    type="button"
                    disabled={isNextDisabled()}
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-[#1A1A2E] hover:bg-[#2A2A3E] text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    Next
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    key="submit-btn"
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto bg-[#F26522] hover:bg-[#D7541A] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-[#F26522]/20 flex items-center justify-center gap-1.5"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Publish Problem
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
