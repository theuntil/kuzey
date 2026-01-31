"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------------- TYPES ---------------- */

export type ChildModeState = {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
};

/* ---------------- STORE ---------------- */

export const useChildModeStore = create<ChildModeState>()(
  persist(
    (set, get) => ({
      enabled: false,
      toggle: () => set({ enabled: !get().enabled }),
      setEnabled: (v) => set({ enabled: v }),
    }),
    {
      name: "child-mode", // localStorage key
    }
  )
);
