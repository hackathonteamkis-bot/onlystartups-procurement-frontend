"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createFundingOpportunity, updateFundingOpportunity, getGovDepartmentData } from "@/actions/gov-department";
import { getSignedUploadUrl } from "@/actions/user/storage";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Button, Input, Label, Textarea } from "@onlystartups/ui";
import { Loader2, ArrowRight, ArrowLeft, Image as ImageIcon, Calendar, Link as LinkIcon, Hash } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";

export default function FundingOpportunityWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editId);
  const [isDragging, setIsDragging] = useState(false);

  // Form Fields
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [keyHighlights, setKeyHighlights] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [closingStatement, setClosingStatement] = useState("");
  const [hashtags, setHashtags] = useState("");

  useEffect(() => {
    if (!editId) return;
    const fetchOpportunity = async () => {
      try {
        const res = await getGovDepartmentData();
        if (res && !res.error) {
          const opp = res.fundingOpportunities?.find((o: any) => o.id === editId);
          if (opp) {
            setImage(opp.image || "");
            setName(opp.name || "");
            setIntroduction(opp.introduction || "");
            setKeyHighlights(opp.keyHighlights || "");
            if (opp.deadline) setDeadline(new Date(opp.deadline).toISOString().split('T')[0]);
            setApplyUrl(opp.applyUrl || "");
            setClosingStatement(opp.closingStatement || "");
            setHashtags(opp.hashtags || "");
          }
        }
      } catch (err) {
        toast.error("Failed to load funding opportunity details");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchOpportunity();
  }, [editId]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handlePublish = async () => {
    if (!name) {
      return toast.error("Title is required.");
    }
    
    setSaving(true);
    try {
      const payload = {
        name,
        image,
        introduction,
        keyHighlights,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        applyUrl,
        closingStatement,
        hashtags,
      };
      
      if (editId) {
        const res = await updateFundingOpportunity(editId, payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Funding opportunity updated successfully!");
          router.push("/gov-department/funding-opportunities");
        }
      } else {
        const res = await createFundingOpportunity(payload);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Funding opportunity created successfully!");
          router.push("/gov-department/funding-opportunities");
        }
      }
    } catch (err) {
      toast.error(editId ? "Failed to update funding opportunity" : "Failed to create funding opportunity");
    } finally {
      setSaving(false);
    }
  };

  const uploadImageFile = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB");
    }

    const toastId = toast.loading("Uploading image...");
    try {
      const authRes = await fetch("/api/auth/session");
      const session = await authRes.json();
      if (!session?.user?.id) throw new Error("Unauthorized");

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${session.user.id}/funding-opportunities/${fileName}`;

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

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(filePath);

      setImage(publicUrl);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload image", { id: toastId });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadImageFile(file);
    } else {
      toast.error("Please upload a valid image file");
    }
  };

  if (initialLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stepNames = ["Basics", "Details", "Outreach"];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-6 px-4 md:px-0">
      
      {/* Header and Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="space-y-1">
          <Link href="/gov-department/funding-opportunities" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mb-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK TO OPPORTUNITIES
          </Link>
          <h1 className="text-3xl font-black text-[#1A1A2E] tracking-tight">
            {editId ? "Edit Funding Opportunity" : "Create Funding Opportunity"}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Set up a new funding opportunity or program.
          </p>
        </div>
        
        {/* Breadcrumb Steps */}
        <div className="flex items-center gap-2 text-sm font-medium overflow-x-auto pb-2 md:pb-0">
          {stepNames.map((name, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className={`transition-colors ${step === i + 1 ? "text-primary font-bold" : step > i + 1 ? "text-gray-900" : "text-muted-foreground"}`}>
                {name}
              </span>
              {i < stepNames.length - 1 && (
                <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-border relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNext}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#1A1A2E]">Step 1: Basics</h2>
                <p className="text-sm text-muted-foreground">The foundational details of your opportunity.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g. Applications Open: Seed Fund 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="introduction">Introduction</Label>
                  <Textarea
                    id="introduction"
                    placeholder="[Organization], supported by [Supporting Org], is inviting applications for..."
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    className="min-h-[100px] bg-gray-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Announcement Poster (4:5 Ratio)</Label>
                  <div 
                    className={`mt-2 flex justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors relative group ${
                      isDragging ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50/50 hover:bg-gray-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {image ? (
                      <div className="relative w-full max-w-sm aspect-[4/5] bg-black/5 rounded-md overflow-hidden flex items-center justify-center">
                        <Image src={image} alt="Poster" fill unoptimized className="w-full h-full object-contain" />
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <ImageIcon className="w-8 h-8 text-white mb-2" />
                          <span className="text-white text-sm font-medium">Change Image</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    ) : (
                      <div className="text-center pointer-events-none">
                        <ImageIcon className={`mx-auto h-12 w-12 ${isDragging ? "text-primary" : "text-gray-300"}`} aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary hover:text-primary/80 pointer-events-auto"
                          >
                            <span>Upload a file</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500 mt-2">PNG, JPG up to 2MB. 4:5 ratio recommended.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button type="submit" className="px-6 rounded-md font-semibold">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.form>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleNext}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#1A1A2E]">Step 2: Details & Timeline</h2>
                <p className="text-sm text-muted-foreground">What does this opportunity offer and when is the deadline?</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="keyHighlights">Key Highlights</Label>
                  <Textarea
                    id="keyHighlights"
                    placeholder="Funding/Grant/Investment\nMentorship/Incubation\nEligibility or key benefit..."
                    value={keyHighlights}
                    onChange={(e) => setKeyHighlights(e.target.value)}
                    className="min-h-[150px] bg-gray-50/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Tip: Use a new line for each highlight.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <div className="relative max-w-sm">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="pl-10 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious} className="px-6 rounded-md font-semibold">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button type="submit" className="px-6 rounded-md font-semibold">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.form>
          )}

          {/* STEP 3: OUTREACH */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#1A1A2E]">Step 3: Outreach</h2>
                <p className="text-sm text-muted-foreground">The final call to action and tags for the announcement.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="applyUrl">Apply Here URL</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="applyUrl"
                      type="url"
                      placeholder="https://..."
                      value={applyUrl}
                      onChange={(e) => setApplyUrl(e.target.value)}
                      className="pl-10 bg-gray-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closingStatement">Closing Statement</Label>
                  <Textarea
                    id="closingStatement"
                    placeholder="If you're building [target startup], this opportunity is worth exploring."
                    value={closingStatement}
                    onChange={(e) => setClosingStatement(e.target.value)}
                    className="min-h-[100px] bg-gray-50/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="hashtags"
                      placeholder="#StartupIndia #Innovation #Funding"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="pl-10 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={handlePrevious} className="px-6 rounded-md font-semibold">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  onClick={handlePublish} 
                  disabled={saving || !name} 
                  className="px-6 rounded-md font-semibold"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                  ) : (
                    <>{editId ? "Update Opportunity" : "Publish Opportunity"}</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
