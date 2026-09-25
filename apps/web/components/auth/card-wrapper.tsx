"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@onlystartups/ui";
import BackButton from "./back-button";
import Header from "./header";
import Social from "./social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-[400px] mx-auto bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_12px_40px_rgb(0,0,0,0.08)] rounded-[1.2rem] sm:rounded-2xl py-0 gap-0 overflow-hidden">
      <CardHeader className="pt-4 pb-3 px-5 sm:px-8">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="px-5 sm:px-8 pt-0 pb-0">
        {children}
      </CardContent>
      <CardFooter className="px-5 sm:px-8 pb-5 sm:pb-6 pt-4 flex flex-col gap-y-4">
        {showSocial && <Social />}
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
