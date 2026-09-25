"use client";

import {
  useState,
  useTransition,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Check,
  Sparkles,
  Building,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import { Label } from "@onlystartups/ui";
import { cn } from "@/lib/utils";
import { completeOnboarding } from "@/actions/user/onboarding";
import { toast } from "sonner";
import { Skeleton } from "@onlystartups/ui";

interface ChoiceOption {
  value: string;
  label: string;
}

interface SlideConfig {
  id: string;
  label: string;
  description: string;
  type: "ROLE" | "TEXT" | "TEXTAREA" | "SELECT_CHOICE" | "MULTI_SELECT_CHOICE" | "SUMMARY";
  placeholder?: string;
  options?: (string | ChoiceOption)[];
  errorMessage?: string;
}

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Onboarding indices & directions
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        width: Math.random() * 6 + 3,
        height: Math.random() * 6 + 3,
        left: `${Math.random() * 100}%`,
        yOffset: -(Math.random() * 200 + 100),
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 1.5,
      }))
    );
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.needsPasswordChange) {
      router.replace("/auth/setup-password");
      return;
    }
    if (status === "authenticated" && session?.user?.onboardingComplete && !isCompleting) {
      router.replace("/dashboard");
    }
  }, [session, status, router, isCompleting]);

  // Unified Form state
  const [formData, setFormData] = useState({
    role: "USER" as "USER" | "STARTUP_HUB",
    firstName: "",
    lastName: "",
    title: "",
    yearsOfExperience: "",
    skills: [] as string[],
    startupName: "",
    startupPhase: "",
    startupDescription: "",
    referralSource: "",
  });

  const [customSkill, setCustomSkill] = useState("");

  // Sync session initial data
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user?.role as "USER" | "STARTUP_HUB") || "USER";
      const firstName = (session.user as any)?.firstName || "";
      const lastName = (session.user as any)?.lastName || "";

      setFormData((prev) => {
        if (prev.role === role && prev.firstName === firstName && prev.lastName === lastName) return prev;
        return {
          ...prev,
          role,
          firstName,
          lastName,
        };
      });
    }
  }, [session, status]);

  // State update helper
  const updateField = useCallback(
    <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const toggleSkill = useCallback((skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  }, []);

  // Compute dynamic slides configuration
  const slides = useMemo(() => {
    const list: SlideConfig[] = [];

    const sessionFirstName = (session?.user as any)?.firstName;
    const sessionLastName = (session?.user as any)?.lastName;

    if (!sessionFirstName) {
      list.push({
        id: "firstName",
        label: "What is your first name?",
        description: "Please enter your first name.",
        type: "TEXT",
        placeholder: "e.g., Jane",
        errorMessage: "First name must be at least 2 characters",
      });
    }

    if (!sessionLastName) {
      list.push({
        id: "lastName",
        label: "What is your last name?",
        description: "Please enter your last name.",
        type: "TEXT",
        placeholder: "e.g., Doe",
        errorMessage: "Last name must be at least 2 characters",
      });
    }

    list.push(
      {
        id: "title",
        label: "What is your professional title?",
        description: "Your role or designation within the startup hub.",
        type: "TEXT",
        placeholder: "e.g., Program Director, Partner",
        errorMessage: "Professional title must be at least 2 characters",
      },
      {
        id: "yearsOfExperience",
        label: "How long have you been active?",
        description: "Your years of experience working in the startup ecosystem.",
        type: "SELECT_CHOICE",
        options: [
          { value: "0-1", label: "0-1 Years" },
          { value: "1-3", label: "1-3 Years" },
          { value: "3-5", label: "3-5 Years" },
          { value: "5-10", label: "5-10 Years" },
          { value: "10+", label: "10+ Years" },
        ],
        errorMessage: "Please select your years of experience",
      },
      {
        id: "skills",
        label: "Select your primary skills",
        description: "Choose the areas you are most specialized in.",
        type: "MULTI_SELECT_CHOICE",
        options: [
          "Product Management", "Software Development", "Design & UX", "Marketing",
          "Sales & BD", "Finance", "Operations", "Data & Analytics", "AI & ML", "Hardware",
        ],
        errorMessage: "Please select at least one area of expertise",
      },
      {
        id: "startupPhase",
        label: "What is your startup hub primary focus?",
        description: "Define the primary focus sector of your startup hub.",
        type: "SELECT_CHOICE",
        options: [
          { value: "Generalist", label: "Generalist / Cross-Sector" },
          { value: "Deeptech", label: "Deeptech / Hardware" },
          { value: "SaaS", label: "Deep Tech / SaaS focus" },
          { value: "Fintech", label: "Fintech / Web3 Hub" },
          { value: "Social", label: "ESG / Social Impact" },
        ],
        errorMessage: "Please select your focus",
      }
    );

    if (formData.startupPhase && formData.startupPhase !== "none") {
      list.push(
        {
          id: "startupName",
          label: "Startup Hub Name",
          description: "Enter the legal or operating name of your entity.",
          type: "TEXT",
          placeholder: "e.g., Synergy Hub",
          errorMessage: "Name must be at least 2 characters",
        },
        {
          id: "startupDescription",
          label: "Mission / Summary",
          description: "Provide a brief mission description or summary (min 10 characters).",
          type: "TEXTAREA",
          placeholder: "e.g., We empower early stage B2B startups with resources and mentorship...",
          errorMessage: "Description must be at least 10 characters",
        }
      );
    }

    list.push(
      {
        id: "referralSource",
        label: "How did you hear about us?",
        description: "Let us know how you discovered the platform.",
        type: "SELECT_CHOICE",
        options: [
          { value: "Google Search", label: "Google Search" },
          { value: "LinkedIn", label: "LinkedIn" },
          { value: "Twitter/X", label: "Twitter/X" },
          { value: "Friend/Colleague", label: "Friend/Colleague" },
          { value: "Event/Conference", label: "Event/Conference" },
          { value: "Other", label: "Other" },
        ],
        errorMessage: "Please tell us how you heard about us",
      },
      {
        id: "summary",
        label: "Profile Summary",
        description: "Final check before your journey begins.",
        type: "SUMMARY",
      }
    );

    return list;
  }, [formData.startupPhase, session?.user]);

  // Bug fix: clamp currentIndex when slides array length changes
  // (e.g. user changes startupPhase which adds/removes slides)
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, slides.length - 1));
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  const canProceed = useMemo(() => {
    if (!currentSlide) return false;
    switch (currentSlide.id) {
      case "firstName":
        return formData.firstName.trim().length >= 2;
      case "lastName":
        return formData.lastName.trim().length >= 2;
      case "title":
        return formData.title.trim().length >= 2;
      case "yearsOfExperience":
        return !!formData.yearsOfExperience;
      case "skills":
        return formData.skills.length > 0;
      case "startupPhase":
        return !!formData.startupPhase;
      case "startupName":
        return formData.startupName.trim().length >= 2;
      case "startupDescription":
        return formData.startupDescription.trim().length >= 10;
      case "referralSource":
        return !!formData.referralSource;
      case "summary":
        return true;
      default:
        return false;
    }
  }, [currentSlide, formData]);

  const handleNext = () => {
    if (!canProceed) {
      const msg = currentSlide?.errorMessage || "Please fill out the field before continuing.";
      toast.error(msg);
      return;
    }

    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentSlide?.type !== "TEXTAREA") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleComplete = () => {
    if (!formData.referralSource) {
      toast.error("Please tell us how you heard about us");
      return;
    }

    setIsCompleting(true);

    startTransition(() => {
      const sessionFirstName = (session?.user as any)?.firstName;
      const sessionLastName = (session?.user as any)?.lastName;

      const onboardingData = {
        ...formData,
        firstName: sessionFirstName || formData.firstName,
        lastName: sessionLastName || formData.lastName,
        role: formData.role,
        startupName:
          formData.startupPhase === "none" ? undefined : formData.startupName,
        startupPhase:
          formData.startupPhase === "none" ? undefined : formData.startupPhase,
        startupDescription:
          formData.startupPhase === "none"
            ? undefined
            : formData.startupDescription,
      };

      completeOnboarding(onboardingData)
        .then(async (data) => {
          if (data.error) {
            setIsCompleting(false);
            toast.error(data.error);
            return;
          }
          if (data.success) {
            await update({ user: { ...onboardingData, onboardingComplete: true } });
            setShowSuccess(true);
          }
        })
        .catch(() => {
          setIsCompleting(false);
          toast.error("Something went wrong!");
        });
    });
  };

  // Auto-redirect after success celebration
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 3500);
    return () => clearTimeout(timer);
  }, [showSuccess, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F5F5EE] relative overflow-hidden font-sans">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#F26522]/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#1A1A2E]/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 h-screen flex flex-col items-center justify-between py-12 px-4 max-w-xl mx-auto">
          {/* Progress System */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32 bg-[#1A1A2E]/10" />
              <Skeleton className="h-3 w-16 bg-[#1A1A2E]/10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-[#1A1A2E]/10" />
          </div>

          {/* Middle Content */}
          <div className="w-full flex-1 flex flex-col justify-center my-8 min-h-[50vh] space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4 bg-[#1A1A2E]/10 rounded-xl" />
              <Skeleton className="h-5 w-1/2 bg-[#1A1A2E]/10 rounded-xl" />
            </div>
            <Skeleton className="h-16 w-full bg-[#1A1A2E]/10 rounded-2xl" />
          </div>

          {/* Bottom Navigation */}
          <div className="w-full flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-24 bg-[#1A1A2E]/10 rounded-xl" />
            <Skeleton className="h-12 w-32 bg-[#1A1A2E]/10 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = slides.length > 0 ? ((currentIndex + 1) / slides.length) * 100 : 0;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 150 : -150,
      opacity: 0,
    }),
  };

  // ── Success Celebration Screen ──
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F5F5EE] relative overflow-hidden font-sans selection:bg-[#F26522]/30 selection:text-[#1A1A2E]">
        {/* Animated background blobs   enlarged & pulsing */}
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#F26522]/8 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/3 -left-1/4 w-[700px] h-[700px] bg-[#1A1A2E]/5 rounded-full blur-[120px]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.width,
                height: p.height,
                left: p.left,
                backgroundColor: i % 3 === 0 ? '#F26522' : i % 3 === 1 ? '#1A1A2E' : '#F26522',
                opacity: 0,
              }}
              animate={{
                y: [typeof window !== 'undefined' ? window.innerHeight : 800, p.yOffset],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-4 md:px-8 max-w-2xl w-full mx-auto">
          {/* Animated checkmark ring */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            {/* Outer ring */}
            <motion.div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#F26522]/20 flex items-center justify-center"
              animate={{ borderColor: ["rgba(242,101,34,0.2)", "rgba(242,101,34,0.5)", "rgba(242,101,34,0.2)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Inner fill */}
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#F26522] to-[#D55516] flex items-center justify-center shadow-lg shadow-[#F26522]/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                >
                  <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={3} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Sparkle accents */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <motion.div
                key={deg}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `rotate(${deg}deg) translateY(-70px)`,
                  transformOrigin: "0 0",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 0.8], opacity: [0, 1, 0.6] }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-[#F26522]" />
              </motion.div>
            ))}
          </motion.div>

          {/* Welcome text */}
          <motion.div
            className="text-center space-y-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] tracking-tight">
              Welcome aboard, {formData.firstName}!
            </h1>
            <p className="text-sm sm:text-base text-[#1A1A2E]/50 font-medium max-w-md mx-auto leading-relaxed">
              Your profile is all set. We&apos;re taking you to your personalized dashboard.
            </p>
          </motion.div>

          {/* Profile card preview */}
          <motion.div
            className="w-full max-w-sm bg-white/60 backdrop-blur-sm rounded-xl border border-[#1A1A2E]/5 p-6 shadow-sm space-y-4"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F26522] to-[#D55516] flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-sm">
                  {formData.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-bold text-[#1A1A2E] text-sm">{`${formData.firstName} ${formData.lastName}`.trim()}</p>
                <p className="text-[10px] font-semibold text-[#1A1A2E]/40 uppercase tracking-wider">
                  {formData.title}
                </p>
              </div>
              <span className="ml-auto text-[8px] font-black uppercase tracking-widest text-[#F26522] bg-[#F26522]/10 px-2.5 py-1 rounded-full">
                {formData.role}
              </span>
            </div>

            {/* Skills badges   staggered entrance */}
            <div className="flex flex-wrap gap-1.5">
              {formData.skills.slice(0, 5).map((skill, i) => (
                <motion.span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-[#1A1A2E]/5 text-[8px] font-bold uppercase tracking-wider text-[#1A1A2E]/70"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.3 + i * 0.08 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            {formData.startupPhase && formData.startupPhase !== "none" && formData.startupName && (
              <motion.div
                className="border-t border-[#1A1A2E]/5 pt-3 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <Building className="w-3.5 h-3.5 text-[#1A1A2E]/30" />
                <span className="text-xs font-bold text-[#1A1A2E]/60">{formData.startupName}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#1A1A2E]/30 ml-auto">
                  {formData.startupPhase}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            className="mt-8 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#F26522]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1A1A2E]/30">
              Preparing your dashboard
            </span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5EE] relative overflow-hidden font-sans selection:bg-[#F26522]/30 selection:text-[#1A1A2E]">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#F26522]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#1A1A2E]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-[100dvh] flex flex-col justify-between py-6 sm:py-12 px-4 md:px-8 max-w-3xl w-full mx-auto">
        {/* Progress System */}
        <div className="w-full">
          <div className="flex items-center justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">
            <span>Onboarding Progress</span>
            <span>
              Step {currentIndex + 1} of {slides.length}
            </span>
          </div>
          <div className="w-full bg-[#1A1A2E]/5 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#F26522] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {/* Transparent Container with sliding animation */}
        <div className="w-full flex-1 flex flex-col justify-center my-4 sm:my-8 overflow-hidden min-h-[50dvh]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onKeyDown={handleKeyPress}
              className="w-full space-y-5 py-4"
            >
              {/* Slide Title & Subtitle */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A2E] tracking-tight leading-snug">
                  {currentSlide?.label}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                  {currentSlide?.description}
                </p>
              </div>

              {/* Dynamic Question Body */}
              <div className="pt-2">
                {currentSlide?.type === "TEXT" && (
                  <input
                    type="text"
                    placeholder={currentSlide.placeholder}
                    value={formData[currentSlide.id as keyof typeof formData] as string || ""}
                    onChange={(e) => updateField(currentSlide.id as any, e.target.value)}
                    className="h-14 sm:h-16 rounded-2xl bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 font-bold text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 focus:border-[#F26522] focus-visible:border-[#F26522] focus:outline-none focus-visible:outline-none shadow-sm text-base sm:text-lg px-5 sm:px-6 transition-all w-full"
                    autoFocus
                  />
                )}

                {currentSlide?.type === "TEXTAREA" && (
                  <textarea
                    placeholder={currentSlide.placeholder}
                    value={formData[currentSlide.id as keyof typeof formData] as string || ""}
                    onChange={(e) => updateField(currentSlide.id as any, e.target.value)}
                    rows={4}
                    className="w-full rounded-xl sm:rounded-2xl bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 font-bold text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 focus:border-[#F26522] focus:outline-none shadow-sm text-base sm:text-lg px-5 sm:px-6 py-3 sm:py-4 transition-all placeholder:font-medium resize-none outline-none"
                    autoFocus
                  />
                )}

                {currentSlide?.type === "SELECT_CHOICE" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pr-1">
                    {currentSlide.options?.map((opt, idx) => {
                      const option = opt as ChoiceOption;
                      const isSelected = formData[currentSlide.id as keyof typeof formData] === option.value;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            updateField(currentSlide.id as any, option.value);
                            setTimeout(() => {
                              setDirection(1);
                              setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
                            }, 250);
                          }}
                          className={cn(
                            "w-full py-3 sm:py-4 px-5 sm:px-6 rounded-xl sm:rounded-2xl border text-left text-sm sm:text-base font-bold transition-all flex items-center justify-between shadow-sm",
                            isSelected
                              ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                              : "bg-[#1A1A2E]/5 text-muted-foreground border-transparent hover:bg-[#1A1A2E]/10 hover:text-[#1A1A2E]"
                          )}
                        >
                          <span>{option.label}</span>
                          <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest opacity-60">
                            {isSelected ? "Selected" : `Choice ${idx + 1}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentSlide?.type === "MULTI_SELECT_CHOICE" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 pr-1">
                      {currentSlide.options?.map((opt) => {
                        const skill = opt as string;
                        const isSelected = formData.skills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={cn(
                              "px-5 py-3 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all border",
                              isSelected
                                ? "bg-[#1A1A2E] border-[#1A1A2E] text-white shadow-md scale-95"
                                : "bg-[#1A1A2E]/5 border-transparent text-[#1A1A2E]/60 hover:bg-[#1A1A2E]/10 hover:text-[#1A1A2E]"
                            )}
                          >
                            {skill}
                          </button>
                        );
                      })}
                      {formData.skills
                        .filter((skill) => !currentSlide.options?.includes(skill))
                        .map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="px-5 py-3 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all border bg-[#1A1A2E] border-[#1A1A2E] text-white shadow-md scale-95"
                          >
                            {skill}
                          </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add other skills..."
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
                              toggleSkill(customSkill.trim());
                              setCustomSkill("");
                            }
                          }
                        }}
                        className="flex-1 w-full p-3 sm:p-4 bg-[#1A1A2E]/5 border-none rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#1A1A2E] text-[#1A1A2E] text-sm font-medium placeholder:text-[#1A1A2E]/40"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
                            toggleSkill(customSkill.trim());
                            setCustomSkill("");
                          }
                        }}
                        className="px-6 rounded-xl sm:rounded-2xl bg-[#1A1A2E] text-white hover:bg-[#1A1A2E]/90 font-bold text-sm tracking-wide"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {currentSlide?.type === "SUMMARY" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-[#1A1A2E]">{`${formData.firstName} ${formData.lastName}`.trim()}</span>
                        <span className="text-[#F26522] text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                          {formData.role}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#1A1A2E]/60 uppercase tracking-wider">
                        {formData.title || "No Title"}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {formData.skills.slice(0, 4).map((s: string) => (
                          <span
                            key={s}
                            className="px-3 py-1.5 rounded-xl bg-[#1A1A2E]/5 text-[9px] sm:text-[10px] font-bold uppercase text-[#1A1A2E]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {formData.startupPhase && formData.startupPhase !== "none" && (
                      <div className="border-t border-[#1A1A2E]/10 pt-4 space-y-1">
                        <p className="text-[10px] font-black uppercase text-[#1A1A2E]/40 tracking-wider">Venture Focus</p>
                        <p className="text-sm font-bold text-[#1A1A2E]">{formData.startupName}</p>
                        <p className="text-xs text-[#1A1A2E]/60 line-clamp-2 leading-relaxed">{formData.startupDescription}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Navigation Buttons */}
        <div className="w-full flex flex-row items-center justify-between gap-3 sm:gap-4 mt-auto pt-4 sm:pt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={cn(
              "font-black text-[10px] uppercase tracking-widest text-[#1A1A2E]/30 hover:text-[#1A1A2E] hover:bg-transparent px-2 sm:px-4",
              currentIndex === 0 && "invisible"
            )}
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={isPending || isCompleting}
            className={cn(
              "px-6 sm:px-8 h-10 sm:h-12 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-md",
              currentIndex === slides.length - 1
                ? "bg-[#F26522] hover:bg-[#D55516] text-white hover:shadow-lg hover:shadow-[#F26522]/20"
                : "bg-[#1A1A2E] hover:bg-black text-white hover:shadow-lg hover:shadow-[#1A1A2E]/20",
              !canProceed && "opacity-50 pointer-events-none"
            )}
          >
            {isPending || isCompleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentIndex === slides.length - 1 ? (
              <>
                Activate
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
