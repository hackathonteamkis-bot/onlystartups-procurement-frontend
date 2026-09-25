"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface BreadcrumbContextType {
  breadcrumbMap: Record<string, string>;
  setBreadcrumb: (id: string, name: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbMap, setBreadcrumbMap] = useState<Record<string, string>>({});

  const setBreadcrumb = useCallback((id: string, name: string) => {
    const key = id.toLowerCase();
    console.log("Setting breadcrumb", { id, key, name });
    setBreadcrumbMap((prev) => {
      if (prev[key] === name) return prev;
      console.log("Breadcrumb map updated", { ...prev, [key]: name });
      return { ...prev, [key]: name };
    });
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbMap, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    // Return dummy values if not wrapped in provider, so it doesn't break
    return { breadcrumbMap: {}, setBreadcrumb: () => {} };
  }
  return context;
}

export function BreadcrumbUpdater({ id, name }: { id: string; name: string }) {
  const { setBreadcrumb } = useBreadcrumbContext();
  
  React.useEffect(() => {
    if (id && name) {
      setBreadcrumb(id, name);
    }
  }, [id, name, setBreadcrumb]);

  return null;
}
