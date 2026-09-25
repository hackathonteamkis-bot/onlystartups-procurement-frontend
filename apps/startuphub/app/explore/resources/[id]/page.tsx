"use client";

import { use } from "react";

import { hardcodedResources } from "@/lib/data/resources";
import { notFound } from "next/navigation";

export default function ResourceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const resource = hardcodedResources.find((r) => r.id === unwrappedParams.id);

  if (!resource) {
    return notFound();
  }

  // Convert Google Drive view link to preview link to embed it
  const embedUrl = resource.url.replace("/view?usp=drive_link", "/preview");

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-background flex flex-col select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative flex-1 w-full bg-muted/10 overflow-hidden">
        {/* Transparent overlay over the top header to prevent clicking the Google Drive pop-out button if possible */}
        <div className="absolute top-0 left-0 w-full h-[60px] bg-transparent z-10" />
        
        <iframe
          src={embedUrl}
          className="w-full h-full border-none"
          allow="autoplay"
        />
      </div>
    </div>
  );
}
