import { useRef } from "react";
import { motion } from "framer-motion";
import {
  HiArrowUpTray,
  HiCamera,
  HiPhoto,
  HiSparkles,
  HiXMark,
} from "react-icons/hi2";
import ResultsPanel from "./ResultsPanel";
import SectionHeading from "./SectionHeading";

function Spinner() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span>Analyzing waste image...</span>
    </div>
  );
}

export default function PredictionStudio({
  selectedFile,
  previewUrl,
  result,
  isLoading,
  isAuthenticated,
  isSavingPrediction,
  isPredictionSaved,
  errorMessage,
  saveMessage,
  saveErrorMessage,
  onFileSelect,
  onPredict,
  onSavePrediction,
  onReset,
}) {
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const fileMeta = selectedFile
    ? {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        type: selectedFile.type || "Unknown format",
      }
    : null;

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    onFileSelect(droppedFile);
  };

  const handleBrowse = (event) => {
    const file = event.target.files?.[0];
    onFileSelect(file);
    event.target.value = "";
  };

  return (
    <section id="predict-workspace" className="section-gap">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Waste Analysis"
          title="Upload, scan, and review waste with a guided workflow"
          description="Use drag and drop, image upload, or camera capture to get a structured result with waste type, bin color, safety notes, and recycling guidance."
        />

        <div className="mt-14 grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand/10 p-3 text-2xl text-brand">
                <HiArrowUpTray />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold">Waste image input</h3>
                <p className="text-sm text-muted">
                  Supports upload, drag and drop, and camera capture
                </p>
              </div>
            </div>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="mt-8 rounded-[2rem] border border-dashed border-brand/35 bg-gradient-to-br from-brand/10 via-white/70 to-brand-moss/10 p-6 transition duration-300 hover:border-brand/50 dark:from-brand/10 dark:via-slate-950/60 dark:to-brand-moss/10"
            >
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBrowse}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleBrowse}
              />

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-3xl text-white dark:bg-white dark:text-slate-950">
                  <HiPhoto />
                </div>
                <h4 className="mt-5 font-heading text-2xl font-bold">
                  Drop an image here or choose an input method
                </h4>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted">
                  Clear lighting and a single visible object will improve confidence
                  and help produce more reliable waste guidance.
                </p>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => uploadInputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand dark:bg-white dark:text-slate-950"
                  >
                    <HiArrowUpTray />
                    Upload image
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white/70 px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-brand/30 hover:text-brand dark:bg-slate-950/40"
                  >
                    <HiCamera />
                    Camera capture
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 rounded-3xl border border-white/15 bg-white/55 p-4 dark:bg-slate-950/35">
                {previewUrl ? (
                  <>
                    <div className="relative overflow-hidden rounded-[1.5rem]">
                      <img src={previewUrl} alt="Waste preview" className="h-72 w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-4 text-white">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/70">Preview ready</p>
                        <p className="mt-1 text-sm font-semibold">Image prepared for AI analysis</p>
                      </div>
                    </div>
                    {fileMeta ? (
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white/70 p-4 dark:bg-slate-900/60">
                          <p className="text-xs uppercase tracking-[0.22em] text-muted">Name</p>
                          <p className="mt-2 truncate text-sm font-semibold">{fileMeta.name}</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 p-4 dark:bg-slate-900/60">
                          <p className="text-xs uppercase tracking-[0.22em] text-muted">Size</p>
                          <p className="mt-2 text-sm font-semibold">{fileMeta.size}</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 p-4 dark:bg-slate-900/60">
                          <p className="text-xs uppercase tracking-[0.22em] text-muted">Format</p>
                          <p className="mt-2 text-sm font-semibold">{fileMeta.type}</p>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className="flex h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-line bg-white/60 text-center dark:bg-slate-950/40">
                    <HiSparkles className="text-4xl text-brand" />
                    <p className="mt-4 font-heading text-xl font-bold">
                      Preview your uploaded waste image
                    </p>
                    <p className="mt-2 max-w-xs text-sm text-muted">
                      The selected image will appear here before analysis begins.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {errorMessage ? (
              <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onPredict}
                disabled={isLoading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-moss px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Spinner /> : "Predict Waste"}
              </button>
              <button
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/70 px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-rose-300 hover:text-rose-500 dark:bg-slate-950/40"
              >
                <HiXMark />
                Clear
              </button>
            </div>
          </motion.div>

          <div id="results" className="grid gap-6">
            <ResultsPanel
              result={result}
              onReset={onReset}
              isAuthenticated={isAuthenticated}
              isSaving={isSavingPrediction}
              isSaved={isPredictionSaved}
              saveMessage={saveMessage}
              saveError={saveErrorMessage}
              onSavePrediction={onSavePrediction}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
