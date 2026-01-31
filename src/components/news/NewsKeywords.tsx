interface Props {
  keywords?: string[] | null;
  lang: "tr" | "en";
}

export default function NewsKeywords({ keywords, lang }: Props) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <section className="mt-3 pt-3 ">
      <h3 className="text-sm font-semibold text-neutral-600 mb-3">
        {lang === "en" ? "Keywords" : "Anahtar Kelimeler"}
      </h3>

      <ul className="flex flex-wrap gap-2" itemProp="keywords">
        {keywords.map((k, i) => (
          <li key={i}>
            <a
              href={`/arama?q=${encodeURIComponent(k)}`}
              rel="tag"
              className="inline-block px-3 py-1 rounded-full bg-neutral-50 text-xs font-medium text-neutral-700 hover:bg-neutral-200 transition"
            >
              {k}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
