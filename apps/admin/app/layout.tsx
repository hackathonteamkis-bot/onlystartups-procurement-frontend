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
  title: "Admin Portal | OnlyStartups",
  description: "Administrative portal for OnlyStartups. Manage startup hubs, users, and platform operations.",
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
