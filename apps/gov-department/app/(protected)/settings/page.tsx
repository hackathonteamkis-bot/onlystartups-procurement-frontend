"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Globe, Shield } from "lucide-react";

import { reset } from "@/actions/auth/reset";
import {
  deleteAccount,
  initiateTwoFactorToggle,
  confirmTwoFactorToggle,
  getMe,
} from "@/actions/user/security";

import { Button } from "@onlystartups/ui";
import { Input } from "@onlystartups/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@onlystartups/ui";

function SettingsSkeleton() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 animate-pulse">
      <div className="h-8 w-48 bg-[#1A1A2E]/5 rounded mb-8" />
      <div className="space-y-8">
        <div className="h-12 w-full bg-[#1A1A2E]/5 rounded-full" />
        <div className="h-64 w-full bg-[#1A1A2E]/5 rounded-2xl" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, update, status } = useSession();
  const [isPending, startTransition] = useTransition();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [is2FAConfirmOpen, setIs2FAConfirmOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [resetCooldown, setResetCooldown] = useState(0);

  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resetCooldown > 0) {
      interval = setInterval(() => {
        setResetCooldown((current) => current - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resetCooldown]);

  useEffect(() => {
    getMe().then(data => {
      if (data && data.accounts) {
        setConnectedAccounts(data.accounts);
      }
    }).catch(e => console.error("Failed to load user data:", e));
  }, []);

  const onResetPassword = () => {
    if (!session?.user?.email || resetCooldown > 0) return;

    startTransition(() => {
      reset({ email: session.user.email as string })
        .then((data) => {
          if (data.error) toast.error(data.error);
          else if (data.success) {
            toast.success(data.success);
            setResetCooldown(60);
          }
        })
        .catch((e) => toast.error(e.message || "Something went wrong"));
    });
  };

  const onInitiate2FA = () => {
    startTransition(() => {
      initiateTwoFactorToggle()
        .then((data) => {
          if (data.error) toast.error(data.error);
          else if (data.success) {
            toast.success(data.success);
            setIs2FAConfirmOpen(true);
          }
        })
        .catch((e) => toast.error(e.message || "Failed to initiate 2FA"));
    });
  };

  const onConfirm2FA = () => {
    if (!twoFactorCode) return;

    startTransition(() => {
      confirmTwoFactorToggle(twoFactorCode)
        .then((data) => {
          if (data.error) toast.error(data.error);
          else if (data.success) {
            const newState = !session?.user?.isTwoFactorEnabled;
            update({ user: { isTwoFactorEnabled: newState } });
            toast.success(data.success);
            setIs2FAConfirmOpen(false);
            setTwoFactorCode("");
          }
        })
        .catch((e) => toast.error(e.message || "Invalid or expired code"));
    });
  };

  const onDeleteAccount = () => {
    startTransition(() => {
      deleteAccount()
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Account deleted successfully.");
            signOut({ callbackUrl: window.location.origin });
          }
        })
        .catch((e) => toast.error(e.message || "Failed to delete account"));
    });
  };

  if (status === "loading") {
    return <SettingsSkeleton />;
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1A1A2E] tracking-tight">
          Settings
        </h1>
        <p className="text-[#1A1A2E]/60 text-sm mt-1">
          Manage your account security and connected platforms.
        </p>
      </div>

      <section className="space-y-4">
        <div className="bg-white/40 backdrop-blur-xl border border-[#1A1A2E]/5 rounded-2xl overflow-hidden divide-y divide-[#1A1A2E]/5 shadow-sm">
              
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1A2E]">Change Password</h3>
                  <p className="text-sm text-[#1A1A2E]/60 mt-1">
                    Securely update your password via an email link.
                  </p>
                </div>
                <Button
                  onClick={onResetPassword}
                  disabled={isPending || resetCooldown > 0}
                  className="w-full sm:w-auto h-10 px-6 rounded-full font-medium text-sm bg-[#1A1A2E] text-white hover:bg-black transition-colors shrink-0"
                >
                  {resetCooldown > 0 ? `Retry in ${resetCooldown}s` : "Reset Password"}
                </Button>
              </div>

              <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1A2E]">Two-Factor Authentication</h3>
                  <p className="text-sm text-[#1A1A2E]/60 mt-1">
                    Add an extra layer of security to your founder account.
                  </p>
                </div>
                <div className="shrink-0 flex items-center justify-end">
                  <Button
                    onClick={onInitiate2FA}
                    disabled={isPending}
                    variant={session?.user?.isTwoFactorEnabled ? "outline" : "default"}
                    className={`w-full sm:w-auto h-10 px-6 rounded-lg font-medium text-sm transition-colors ${
                      session?.user?.isTwoFactorEnabled
                        ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                        : "bg-[#1A1A2E] text-white hover:bg-black"
                    }`}
                  >
                    {session?.user?.isTwoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-[#1A1A2E]">Connected Accounts</h3>
                  <p className="text-sm text-[#1A1A2E]/60 mt-1 mb-3">
                    Link or unlink third-party accounts for easier login.
                  </p>
                  <div className="flex gap-3 items-center flex-wrap">
                    {connectedAccounts.length > 0 ? (
                      connectedAccounts.map((acc, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                          <Globe className="w-3.5 h-3.5" /> {acc.provider} (Linked)
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#1A1A2E]/40 italic">No connected accounts</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-semibold text-red-600">Delete Account</h3>
                  <p className="text-sm text-[#1A1A2E]/60 mt-1">
                    Permanently delete your account and all associated startup data.
                  </p>
                </div>
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isPending}
                  variant="outline"
                  className="w-full sm:w-auto h-10 px-6 rounded-lg font-medium text-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors shrink-0 bg-transparent"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </section>

      {/* Modals */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl bg-white border border-[#1A1A2E]/10 p-6 sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-[#1A1A2E]">
              Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#1A1A2E]/60 pt-2 leading-relaxed">
              This action cannot be undone. You will permanently lose all your data, startup details, and access to the ecosystem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 sm:space-x-4">
            <AlertDialogCancel className="h-10 rounded-full font-medium text-sm bg-transparent border border-[#1A1A2E]/10 hover:bg-[#1A1A2E]/5 text-[#1A1A2E] w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteAccount}
              disabled={isPending}
              className="h-10 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto border-none"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={is2FAConfirmOpen} onOpenChange={setIs2FAConfirmOpen}>
        <AlertDialogContent className="rounded-2xl bg-white border border-[#1A1A2E]/10 p-6 sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-[#1A1A2E]">
              Verify your email
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#1A1A2E]/60 pt-2">
              We&apos;ve sent a 6-digit security code to your email. Enter it below to enable two-factor authentication.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-6">
            <Input
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              maxLength={6}
              className="text-center text-3xl tracking-[0.5em] h-16 font-semibold bg-[#1A1A2E]/5 border-none rounded-full focus-visible:ring-2 focus-visible:ring-[#1A1A2E]/20 placeholder:text-[#1A1A2E]/20"
            />
          </div>

          <AlertDialogFooter className="sm:space-x-4">
            <AlertDialogCancel className="h-10 rounded-full font-medium text-sm bg-transparent border border-[#1A1A2E]/10 hover:bg-[#1A1A2E]/5 text-[#1A1A2E] w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirm2FA();
              }}
              disabled={isPending || twoFactorCode.length !== 6}
              className="h-10 rounded-full font-medium text-sm bg-[#1A1A2E] text-white hover:bg-black w-full sm:w-auto border-none"
            >
              Verify
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
