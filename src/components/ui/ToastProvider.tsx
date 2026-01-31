"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import Toast from "./Toast";

type ToastType = "success" | "error";

type ToastContextType = {
  show: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((message: string, type: ToastType = "success") => {
    // 🔴 Önceki timeout'u temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Yeni toast
    setToast({ message, type });

    // Yeni timeout
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, 2600);
  }, []);

  const close = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={close}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
