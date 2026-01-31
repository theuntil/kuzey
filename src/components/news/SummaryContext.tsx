"use client";

import { createContext, useContext, useState } from "react";

export type SummaryPayload = {
  ai_status: string | null;
  title_ai: string | null;
  summary: string | null;
};

type SummaryContextType = {
  isOpen: boolean;
  payload: SummaryPayload | null;
  openSummary: (data: SummaryPayload) => void;
  closeSummary: () => void;
};

const SummaryContext = createContext<SummaryContextType | null>(null);

export function SummaryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<SummaryPayload | null>(null);

  function openSummary(data: SummaryPayload) {
    setPayload(data);
    setIsOpen(true);
  }

  function closeSummary() {
    setIsOpen(false);
  }

  return (
    <SummaryContext.Provider
      value={{ isOpen, payload, openSummary, closeSummary }}
    >
      {children}
    </SummaryContext.Provider>
  );
}

export function useSummary() {
  const ctx = useContext(SummaryContext);
  if (!ctx) {
    throw new Error("useSummary must be used inside SummaryProvider");
  }
  return ctx;
}
