import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { getSession } from "@/lib/auth";
import { Toaster } from "@onlystartups/ui";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "OnlyStartups | Shared Workspace for Startup Hubs & Founders",
  description: "OnlyStartups is a shared workspace for startup hubs and founders to collaborate, manage programs, connect with communities, and grow startups—all from one platform.",
  keywords: "startup management, startup workspace, startup hubs, founders, startup ecosystem, startup collaboration, incubator software, founder platform, startup community, India startups",
  openGraph: {
    title: "OnlyStartups | Shared Workspace for Startup Hubs & Founders",
    description: "Powering India's startup ecosystem with one collaborative workspace to build, connect, and grow.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en" className={`${jakarta.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased">
        {process.env.NODE_ENV === "development" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then((registrations) => {
                    let unregistered = false;
                    for (const registration of registrations) {
                      registration.unregister();
                      unregistered = true;
                    }
                    if (unregistered) {
                      console.log('Unregistered stale service worker in development mode');
                      window.location.reload();
                    }
                  });
                }
              `,
            }}
          />
        )}
        <SessionProvider session={session}>
          {children}
          <Toaster position="bottom-right" richColors />
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
