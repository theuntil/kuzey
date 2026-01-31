"use client";

import { useEffect, useState } from "react";
import PolicySidebar from "./PolicySidebar";
import PolicyContent from "./PolicyContent";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

export default function PolicyLayout({ policies }: { policies: any[] }) {

  const [activeId, setActiveId] = useState<string>(policies[0].id);

  /* HASH + SCROLL FIX */
  useEffect(() => {
 useAutoPageView(); 
    const hash = window.location.hash.replace("#", "");
    if (hash) setActiveId(hash);

    // SAYFA HER ZAMAN EN ÜSTTEN BAŞLASIN
    window.scrollTo(0, 0);

  }, [policies]);

  const activePolicy = policies.find(p => p.id === activeId);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">

        <PolicySidebar
          policies={policies}
          activeId={activeId}
          onSelect={setActiveId}
        />

        <div key={activeId} className="animate-fadeIn">
          <PolicyContent policy={activePolicy} />
        </div>

      </div>
    </div>
  );
}
