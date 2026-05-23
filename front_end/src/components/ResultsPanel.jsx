import { motion } from "framer-motion";
import {
  HiArrowDownTray,
  HiCheckBadge,
  HiGlobeAlt,
  HiLightBulb,
  HiShieldExclamation,
  HiSparkles,
  HiTrash,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import LowConfidencePanel from "./LowConfidencePanel";
import { getBinTheme, parsePredictionLabel } from "../utils/prediction";

function InfoCard({ label, value, accent = "text-brand" }) {
  return (
    <div className="rounded-2xl border border-line bg-white/55 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] dark:bg-slate-950/35">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className={`mt-3 text-base font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

function BulletGroup({ title, items, tone = "brand" }) {
  if (!items?.length) {
    return null;
  }

  const tones = {
    brand: "border-brand/15 bg-brand/10 text-brand dark:text-brand-soft",
    danger: "border-rose-500/15 bg-rose-500/10 text-rose-700 dark:text-rose-200",
    neutral: "border-line bg-white/70 text-ink dark:bg-slate-900/60",
  };

  return (
    <div className="rounded-2xl border border-line bg-white/55 p-5 dark:bg-slate-950/35">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">{title}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${tones[tone]}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function BinVisualization({ binName, itemName, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${theme.shell} p-6 text-white ${theme.glow}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_24%)]" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
          Recommended bin
        </p>
        <h4 className="mt-3 font-heading text-2xl font-bold">{binName}</h4>
        <p className="mt-2 text-sm text-white/80">{itemName} should be routed here.</p>

        <div className="mt-8 flex justify-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-x-2 bottom-[-12px] h-5 rounded-full bg-black/20 blur-md" />
            <div className="relative mx-auto w-28">
              <div className="mx-auto h-6 w-20 rounded-t-[1.25rem] bg-white/80" />
              <div className="absolute right-5 top-1 h-4 w-5 rounded-full border-2 border-white/75" />
              <div className="mt-[-2px] h-28 rounded-[1.7rem] bg-black/15 p-2 backdrop-blur-sm">
                <div className="flex h-full items-center justify-center rounded-[1.25rem] border border-white/20 bg-white/10">
                  <HiTrash className="text-4xl text-white/90" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function SavePredictionBanner({
  isAuthenticated,
  isSaving,
  isSaved,
  saveMessage,
  saveError,
  onSavePrediction,
}) {
  if (isAuthenticated) {
    return (
      <div className="mt-6 rounded-[1.75rem] border border-line bg-white/60 p-5 dark:bg-slate-950/35">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Want to keep this result for later?</p>
            <p className="mt-1 text-sm text-muted">
              Save it to your personal history so you can revisit the waste image and guidance anytime.
            </p>
          </div>
          <button
            onClick={onSavePrediction}
            disabled={isSaving || isSaved}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-moss px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiArrowDownTray />
            {isSaved ? "Saved to History" : isSaving ? "Saving..." : "Save Prediction"}
          </button>
        </div>

        {saveError ? (
          <div className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
            {saveError}
          </div>
        ) : null}

        {saveMessage ? (
          <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
            {saveMessage}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-[1.75rem] border border-line bg-white/60 p-5 dark:bg-slate-950/35">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Login to save this prediction</p>
          <p className="mt-1 text-sm text-muted">
            Create an account or sign in to build your personal waste prediction history.
          </p>
        </div>
        <Link
          to="/login"
          state={{ from: "/predict" }}
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand dark:bg-white dark:text-slate-950"
        >
          Login to Save
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPanel({
  result,
  onReset,
  isAuthenticated,
  isSaving,
  isSaved,
  saveMessage,
  saveError,
  onSavePrediction,
}) {
  if (!result) {
    return (
      <div className="glass-panel p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand/10 text-3xl text-brand">
          <HiSparkles />
        </div>
        <h3 className="mt-5 font-heading text-2xl font-bold">
          Prediction insights will appear here
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted">
          Upload a waste image to unlock classification, bin guidance, disposal
          instructions, recycling value, and sustainability insights.
        </p>
      </div>
    );
  }

  if (!result.success) {
    return (
      <LowConfidencePanel
        message={result.message}
        tips={result.tips || []}
        onReset={onReset}
      />
    );
  }

  const { prediction, analysis } = result;
  const confidence = Number(prediction.confidence || 0);
  const { itemName, binName, binColor } = parsePredictionLabel(prediction.class, analysis);
  const theme = getBinTheme(binColor);
  const confidenceWidth = `${Math.min(Math.max(confidence, 0), 100)}%`;

  return (
    <motion.div
      id="results"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6"
    >
      <div className="glass-panel overflow-hidden p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
              <HiCheckBadge />
              Prediction successful
            </div>
            <h3 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {itemName}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              The uploaded item has been matched to a waste stream with a clear bin
              recommendation, disposal path, and supporting sustainability guidance.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-2xl border ${theme.border} bg-white/65 p-5 dark:bg-slate-950/35`}>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Waste type</p>
                <p className="mt-3 text-lg font-semibold">{itemName}</p>
              </div>
              <div className={`rounded-2xl border ${theme.border} bg-white/65 p-5 dark:bg-slate-950/35`}>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Bin assignment</p>
                <p className="mt-3 text-lg font-semibold">{binName}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-line bg-slate-950 p-5 text-white dark:bg-slate-800">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Confidence score</span>
                <span>{confidence.toFixed(2)}%</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: confidenceWidth }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
                />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <span className={`rounded-full px-3 py-2 text-center text-sm font-semibold ${theme.soft}`}>
                  {analysis.waste_type}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2 text-center text-sm font-semibold">
                  {analysis.recyclable ? "Recyclable stream" : "Limited recycling"}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2 text-center text-sm font-semibold">
                  {analysis.hazardous ? "Handle with caution" : "Standard handling"}
                </span>
              </div>
            </div>

            <SavePredictionBanner
              isAuthenticated={isAuthenticated}
              isSaving={isSaving}
              isSaved={isSaved}
              saveMessage={saveMessage}
              saveError={saveError}
              onSavePrediction={onSavePrediction}
            />
          </div>

          <BinVisualization binName={binName} itemName={itemName} theme={theme} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard label="Recyclable" value={analysis.recyclable ? "Yes" : "No"} />
        <InfoCard
          label="Hazardous"
          value={analysis.hazardous ? "Yes" : "No"}
          accent={analysis.hazardous ? "text-rose-500" : "text-emerald-500"}
        />
        <InfoCard label="Carbon impact" value={analysis.carbon_impact} />
        <InfoCard
          label="Earning potential"
          value={analysis.earning_potential ? "Possible" : "Not likely"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.95fr]">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand/10 p-3 text-2xl text-brand">
              <HiSparkles />
            </div>
            <div>
              <h4 className="font-heading text-xl font-bold">Recycling tips</h4>
              <p className="text-sm text-muted">How to recover more value from this waste</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <InfoCard label="Estimated recycling value" value={analysis.recycling_value?.estimated_value || "Unknown"} />
            <InfoCard label="Selling or recovery path" value={analysis.recycling_value?.selling_method || "Unknown"} />
            <BulletGroup
              title="Valuable materials"
              items={analysis.recycling_value?.valuable_materials || []}
            />
            <BulletGroup
              title="Reuse suggestions"
              items={analysis.reuse_suggestions?.length ? analysis.reuse_suggestions : ["No direct reuse suggestions available"]}
              tone="neutral"
            />
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-2xl text-emerald-500">
              <HiLightBulb />
            </div>
            <div>
              <h4 className="font-heading text-xl font-bold">Disposal instructions</h4>
              <p className="text-sm text-muted">Clear action steps after classification</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-line bg-white/55 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] dark:bg-slate-950/35">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Recommended disposal method</p>
              <p className="mt-3 text-base font-semibold">{analysis.disposal_method}</p>
            </div>
            <BulletGroup
              title="Safety precautions"
              items={analysis.safety_precautions || []}
              tone={analysis.hazardous ? "danger" : "neutral"}
            />
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/10 p-3 text-2xl text-sky-500">
              <HiGlobeAlt />
            </div>
            <div>
              <h4 className="font-heading text-xl font-bold">Environmental impact</h4>
              <p className="text-sm text-muted">Why this disposal decision matters</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-[1.75rem] border border-line bg-gradient-to-br from-white/75 to-brand/5 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] dark:from-slate-950/45 dark:to-brand/10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Impact summary</p>
              <p className="mt-3 text-sm leading-7">{analysis.environmental_impact}</p>
            </div>

            <div className="rounded-[1.75rem] border border-line bg-white/55 p-5 dark:bg-slate-950/35">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-rose-500/10 p-3 text-xl text-rose-500">
                  <HiShieldExclamation />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Handling status</p>
                  <p className="mt-2 text-base font-semibold">
                    {analysis.hazardous ? "Requires extra care during disposal" : "Suitable for normal guided handling"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
