export default function PolicyContent({ policy }: any) {
  if (!policy) return null;

  return (
    <article
      className="
        rounded-2xl
        border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-xl
        p-6 md:p-10
      "
    >
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          {policy.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Son güncelleme: {policy.updatedAt}
        </p>
      </header>

      <div className="prose prose-invert max-w-none">
        {policy.content.map((block: any, i: number) => {
          if (block.type === "p")
            return <p key={i}>{block.text}</p>;

          if (block.type === "h3")
            return (
              <h3 key={i} className="text-lg font-semibold">
                {block.text}
              </h3>
            );

          return null;
        })}
      </div>
    </article>
  );
}
