"use client";

import { newVerification } from "@/actions/auth/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing Token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          toast.success(data.success);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        }
      })
      .catch(() => {
        setError("Failed to verify your email. The link may have expired.");
        toast.error("Failed to verify your email. The link may have expired.");
      });
  }, [token, success, error, router]);

  useEffect(() => {
     
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/"
      backButtonLabel="Back to login"
    >
      <div className="flex flex-col items-center w-full justify-center py-4 space-y-4">
        {!success && !error && (
          <div className="flex flex-col items-center gap-3">
            <BeatLoader color="#F26522" size={10} />
            <p className="text-[#1A1A2E]/60 text-xs sm:text-sm font-medium">
              Verifying your email...
            </p>
          </div>
        )}
        {success && (
          <p className="text-emerald-500 font-medium text-sm">{success}</p>
        )}
        {error && <p className="text-red-500 font-medium text-sm">{error}</p>}
      </div>
    </CardWrapper>
  );
};
