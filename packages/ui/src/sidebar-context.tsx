"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
  isMinimized: boolean;
  toggleMinimized: () => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-minimized");
      return saved === "true";
    }
    return false;
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const toggleMinimized = () => {
    setIsMinimized((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebar-minimized", String(newState));
      return newState;
    });
  };

  return (
    <SidebarContext.Provider
      value={{ isMinimized, toggleMinimized, isSheetOpen, setIsSheetOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
