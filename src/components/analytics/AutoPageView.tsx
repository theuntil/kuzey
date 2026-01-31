"use client";

import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

export default function AutoPageView() {
  useAutoPageView("static");
  return null;
}
