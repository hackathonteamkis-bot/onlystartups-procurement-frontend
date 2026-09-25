"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[GLOBAL_ERROR]", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Application Error</title>
      </head>
      <body className="margin-0 padding-0">
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#f5f5ee] to-[#e8e8df] dark:from-[#12121e] dark:to-[#1a1a2e] px-6 text-center select-none font-sans">
          <div className="relative w-full max-w-md p-8 rounded-2xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 mb-6">
              <AlertCircle className="h-9 w-9" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Critical Error
            </h1>
            
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              A critical application error occurred. Please try restarting the application.
            </p>

            {error.digest && (
              <div className="mt-3 inline-block px-3 py-1 rounded-md bg-black/5 dark:bg-white/5 text-[11px] font-mono text-muted-foreground">
                Ref: {error.digest}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer border-0"
              >
                <RotateCcw className="h-4 w-4" />
                Reload Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
