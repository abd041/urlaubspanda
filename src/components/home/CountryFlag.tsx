const FLAG_CODES: Record<string, string> = {
  oesterreich: "at",
  deutschland: "de",
  italien: "it",
  kroatien: "hr",
  griechenland: "gr",
  aegypten: "eg",
  spanien: "es",
  suedtirol: "it",
  staedtereisen: "eu",
};

function FlagSvg({ code }: { code: string }) {
  switch (code) {
    case "at":
      return (
        <svg viewBox="0 0 21 15" className="h-full w-full" aria-hidden="true">
          <rect width="21" height="15" fill="#ED2939" />
          <rect y="5" width="21" height="5" fill="#fff" />
        </svg>
      );
    case "de":
      return (
        <svg viewBox="0 0 21 15" className="h-full w-full" aria-hidden="true">
          <rect width="21" height="5" fill="#000" />
          <rect y="5" width="21" height="5" fill="#DD0000" />
          <rect y="10" width="21" height="5" fill="#FFCE00" />
        </svg>
      );
    case "it":
      return (
        <svg viewBox="0 0 21 15" className="h-full w-full" aria-hidden="true">
          <rect width="7" height="15" fill="#009246" />
          <rect x="7" width="7" height="15" fill="#fff" />
          <rect x="14" width="7" height="15" fill="#CE2B37" />
        </svg>
      );
    case "hr":
      return (
        <svg viewBox="0 0 21 15" className="h-full w-full" aria-hidden="true">
          <rect width="21" height="5" fill="#FF0000" />
          <rect y="5" width="21" height="5" fill="#fff" />
          <rect y="10" width="21" height="5" fill="#171796" />
        </svg>
      );
    case "gr":
      return (
        <svg viewBox="0 0 27 18" className="h-full w-full" aria-hidden="true">
          <rect width="27" height="18" fill="#0D5EAF" />
          <rect y="2" width="27" height="2" fill="#fff" />
          <rect y="6" width="27" height="2" fill="#fff" />
          <rect y="10" width="27" height="2" fill="#fff" />
          <rect y="14" width="27" height="2" fill="#fff" />
          <rect width="10" height="10" fill="#0D5EAF" />
          <rect x="4" width="2" height="10" fill="#fff" />
          <rect y="4" width="10" height="2" fill="#fff" />
        </svg>
      );
    case "eg":
      return (
        <svg viewBox="0 0 21 15" className="h-full w-full" aria-hidden="true">
          <rect width="21" height="5" fill="#CE1126" />
          <rect y="5" width="21" height="5" fill="#fff" />
          <rect y="10" width="21" height="5" fill="#000" />
          <path fill="#C09300" d="M10.5 6.1l.55 1.7h1.8l-1.45 1.05.55 1.7-1.45-1.05-1.45 1.05.55-1.7-1.45-1.05h1.8z" />
        </svg>
      );
    case "es":
      return (
        <svg viewBox="0 0 21 15" className="h-full w-full" aria-hidden="true">
          <rect width="21" height="15" fill="#AA151B" />
          <rect y="4" width="21" height="7" fill="#F1BF00" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 21 15" className="h-full w-full" aria-hidden="true">
          <rect width="21" height="15" fill="#1B63EB" />
          <circle cx="10.5" cy="7.5" r="3.5" fill="none" stroke="#fff" strokeWidth="1.2" />
        </svg>
      );
  }
}

export function CountryFlag({ slug, name }: { slug: string; name: string }) {
  const code = FLAG_CODES[slug] ?? "eu";
  return (
    <span
      className="relative block h-[15px] w-[21px] shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(15,26,43,0.08)]"
      aria-hidden="true"
      title={name}
    >
      <FlagSvg code={code} />
    </span>
  );
}
