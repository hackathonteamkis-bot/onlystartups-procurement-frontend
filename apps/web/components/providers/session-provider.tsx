"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

interface Props {
  children: React.ReactNode;
  session: Session | null;
}

export function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider
      session={session}
      refetchOnWindowFocus={true}
      refetchInterval={60}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
