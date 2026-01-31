"use client";

export default function PolicySidebar({
  policies,
  activeId,
  onSelect,
}: any) {
  return (
    <aside className="md:sticky md:top-24 h-fit">
      <div className="rounded-2xl  bg-white/70 backdrop-blur-xl p-3 shadow-sm">
        <ul className="space-y-1">
          {policies.map((p: any) => {
            const active = activeId === p.id;

            return (
              <li key={p.id}>
                <button
                  onClick={() => {
                    window.location.hash = p.id;
                    onSelect(p.id);
                  }}
                  className={`
                    w-full text-left px-4 py-3 rounded-xl
                    transition-all duration-300
                    flex items-center gap-3
                    ${
                      active
                        ? "bg-blue-600/10 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  <span
                    className={`
                      h-2 w-2 rounded-full
                      transition-all
                      ${active ? "bg-blue-600" : "bg-slate-300"}
                    `}
                  />
                  <span className="text-sm font-medium">
                    {p.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
