"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@onlystartups/ui";
import { Button } from "@onlystartups/ui";
import { Textarea } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { createFundingOpportunity } from "@/actions/gov-department";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface CreateSchemeDialogProps {
  onSuccess: () => void;
}

export function CreateSchemeDialog({ onSuccess }: CreateSchemeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fundAmount: "",
    description: "",
    eligibility: "",
    benefits: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createFundingOpportunity(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        setOpen(false);
        setFormData({
          name: "",
          fundAmount: "",
          description: "",
          eligibility: "",
          benefits: "",
        });
        onSuccess();
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-6 py-6 rounded-full bg-[#1A1A2E] text-white font-black uppercase tracking-widest hover:bg-[#F26522] transition-all shadow-lg hover:shadow-[#F26522]/20">
          <Plus className="w-5 h-5" /> New Scheme
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#1A1A2E]">
            Create New Funding Opportunity
          </DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Define a new government or private grant for your portfolio startups
            to track.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Scheme Name
              </Label>
              <Input
                placeholder="e.g. MahaFund Seed Grant"
                className="rounded-full border-[#1A1A2E]/20"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Fund Amount / Value
              </Label>
              <Input
                placeholder="e.g. ₹5,00,000"
                className="rounded-full border-[#1A1A2E]/20"
                value={formData.fundAmount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fundAmount: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Detailed Description
            </Label>
            <Textarea
              placeholder="Objectives and main features of the opportunity..."
              className="rounded-xl border-[#1A1A2E]/20 min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Eligibility Criteria
            </Label>
            <Textarea
              placeholder="Who can apply? (e.g. Early stage, tech-focused, etc.)"
              className="rounded-xl border-[#1A1A2E]/20 min-h-[100px] resize-none"
              value={formData.eligibility}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  eligibility: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Benefits
            </Label>
            <Textarea
              placeholder="What does the startup get? (e.g. Equity-free funding, Mentorship)"
              className="rounded-xl border-[#1A1A2E]/20 min-h-[100px] resize-none"
              value={formData.benefits}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  benefits: e.target.value,
                }))
              }
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl font-bold uppercase text-[10px] tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full px-8 bg-primary font-bold uppercase text-[10px] tracking-widest"
            >
              {loading && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
              Create Scheme
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
