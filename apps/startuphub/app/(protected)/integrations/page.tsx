"use client";
import Image from "next/image";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@onlystartups/ui";

const INTEGRATIONS = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Process application fees and collect program tuition.',
    icon: 'https://cdn.simpleicons.org/razorpay/02042B'
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    description: 'Track how founders navigate the platform.',
    icon: 'https://cdn.simpleicons.org/googleanalytics/E37400'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Automatically create private channels for new programs.',
    icon: 'https://logo.clearbit.com/slack.com'
  },
  {
    id: 'resend',
    name: 'Resend',
    description: 'Automate founder onboarding drip campaigns.',
    icon: 'https://cdn.simpleicons.org/resend/000000'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Sync startup profiles and pipeline stages.',
    icon: 'https://cdn.simpleicons.org/hubspot/FF7A59'
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Track signatures for SAFE notes and NDAs.',
    icon: 'https://logo.clearbit.com/docusign.com'
  }
];

export default function IntegrationsPage() {
  const { data: session } = useSession();

  return (
    <div className="w-full px-1 sm:px-2 py-4 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-500 text-sm mt-1">
          Connect third-party services to enhance your experience.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {/* Google Calendar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-xl shadow-sm gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex gap-2 shrink-0 mt-1 sm:mt-0">
              <Image 
                src="https://cdn.simpleicons.org/googlecalendar/4285F4" 
                alt="Google Calendar"
                width={24}
                height={24}
                unoptimized
                className="w-6 h-6 object-contain" 
              />
              <Image 
                src="https://cdn.simpleicons.org/googlemeet/00832D" 
                alt="Google Meet"
                width={24}
                height={24}
                unoptimized
                className="w-6 h-6 object-contain" 
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Google Workspace</p>
              <p className="text-xs text-gray-500">Automatically create calendar bookings and video links.</p>
            </div>
          </div>
          
          <div className="self-end sm:self-auto">
            {session?.user?.hasGoogleCalendarConnected ? (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Connected
              </span>
            ) : (
              <Button 
                variant="outline"
                size="sm"
                className="text-xs h-8 w-full sm:w-auto"
                onClick={async () => {
                  const token = (session?.user as any)?.accessToken || (session as any)?.accessToken;
                  if (token) {
                    document.cookie = `link_token=${token}; path=/; max-age=300; SameSite=Lax`;
                  }
                  const result = await signIn('google-calendar', { prompt: 'consent', redirect: false });
                  if (result?.url) {
                    window.location.href = result.url;
                  }
                }}
              >
                Connect
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Integration List */}
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-xl shadow-sm gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <Image src={integration.icon} alt={integration.name} fill unoptimized className="w-6 h-6 shrink-0 object-contain mt-1 sm:mt-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{integration.name}</p>
                <p className="text-xs text-gray-500">{integration.description}</p>
              </div>
            </div>

            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 self-end sm:self-auto shrink-0">
              Coming Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
