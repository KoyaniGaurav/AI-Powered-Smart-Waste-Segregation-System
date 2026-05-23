export function startCase(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function parsePredictionLabel(rawLabel, analysis) {
  const normalized = String(rawLabel || "").trim();

  if (!normalized) {
    return {
      itemName: "Unknown Waste",
      binName: analysis?.bin_color ? `${startCase(analysis.bin_color)} Bin` : "Unknown Bin",
      binColor: startCase(analysis?.bin_color || "Unknown"),
    };
  }

  const [binPrefix, ...rest] = normalized.split("_");
  const itemName = startCase(rest.join(" ") || normalized);
  const rawBinColor = analysis?.bin_color || binPrefix || "Unknown";

  return {
    itemName,
    binName: `${startCase(rawBinColor)} Bin`,
    binColor: startCase(rawBinColor),
  };
}

export function getBinTheme(binColor) {
  const themes = {
    Green: {
      shell: "from-emerald-500 via-emerald-600 to-lime-600",
      glow: "shadow-[0_24px_60px_rgba(34,197,94,0.26)]",
      soft: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-500/20",
      progress: "from-emerald-300 via-emerald-400 to-lime-300",
    },
    Blue: {
      shell: "from-sky-500 via-blue-600 to-cyan-600",
      glow: "shadow-[0_24px_60px_rgba(59,130,246,0.28)]",
      soft: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
      border: "border-sky-500/20",
      progress: "from-sky-300 via-blue-400 to-cyan-300",
    },
    Black: {
      shell: "from-slate-700 via-slate-900 to-black",
      glow: "shadow-[0_24px_60px_rgba(15,23,42,0.32)]",
      soft: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950",
      border: "border-slate-500/20",
      progress: "from-slate-400 via-slate-300 to-white",
    },
    Red: {
      shell: "from-rose-500 via-red-600 to-red-700",
      glow: "shadow-[0_24px_60px_rgba(239,68,68,0.28)]",
      soft: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
      border: "border-rose-500/20",
      progress: "from-rose-300 via-red-400 to-orange-300",
    },
  };

  return themes[binColor] || themes.Green;
}

export function formatHistoryDate(value) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
