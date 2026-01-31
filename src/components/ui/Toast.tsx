  "use client";

  import { Check, X, AlertTriangle } from "lucide-react";

  export default function Toast({
    message,
    type,
    onClose,
  }: {
    message: string;
    type: "success" | "error";
    onClose: () => void;
  }) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-999999
        animate-toastIn">
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl
          backdrop-blur-xl shadow-lg text-xs
          ${type === "success"
            ? "bg-emerald-500/50 text-white"
            : "bg-red-500/50 text-white"}`}
        >
          {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }
