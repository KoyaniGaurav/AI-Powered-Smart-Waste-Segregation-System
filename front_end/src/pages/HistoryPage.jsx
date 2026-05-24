import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiEye,
  HiMagnifyingGlass,
  HiOutlineTrash,
  HiShieldCheck,
  HiSparkles,
} from "react-icons/hi2";
import { deletePrediction, fetchPredictionDetail, fetchPredictionHistory } from "../services/api";
import { formatHistoryDate, parsePredictionLabel, startCase } from "../utils/prediction";

function DetailInfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-white/60 p-4 dark:bg-slate-950/40">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}

function DetailList({ title, items, emptyText = "No additional information available" }) {
  return (
    <div className="rounded-2xl border border-line bg-white/60 p-5 dark:bg-slate-950/40">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">{title}</p>
      {items?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-brand/15 bg-brand/10 px-3 py-1.5 text-sm text-brand"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">{emptyText}</p>
      )}
    </div>
  );
}

function DetailModal({ prediction, onClose }) {
  if (!prediction) {
    return null;
  }

  const { itemName, binName } = parsePredictionLabel(
    prediction.predicted_class,
    prediction.analysis
  );
  const analysis = prediction.analysis || {};
  const recyclingValue = analysis.recycling_value || {};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          className="glass-panel max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6 sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[2rem] border border-line">
              <img
                src={prediction.image_url}
                alt={itemName}
                className="h-full min-h-[18rem] w-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
                Prediction details
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold">{itemName}</h2>
              <p className="mt-2 text-sm text-muted">{binName}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailInfoCard
                  label="Confidence"
                  value={`${prediction.confidence.toFixed(2)}%`}
                />
                <DetailInfoCard
                  label="Saved on"
                  value={formatHistoryDate(prediction.created_at)}
                />
                <DetailInfoCard
                  label="Waste type"
                  value={analysis.waste_type || "Unknown"}
                />
                <DetailInfoCard
                  label="Bin color"
                  value={analysis.bin_color ? `${startCase(analysis.bin_color)} Bin` : "Unknown"}
                />
                <DetailInfoCard
                  label="Recyclable"
                  value={analysis.recyclable ? "Yes" : "No"}
                />
                <DetailInfoCard
                  label="Hazardous"
                  value={analysis.hazardous ? "Yes" : "No"}
                />
                <DetailInfoCard
                  label="Carbon impact"
                  value={analysis.carbon_impact || "Unknown"}
                />
                <DetailInfoCard
                  label="Earning potential"
                  value={analysis.earning_potential ? "Possible" : "Not likely"}
                />
                <DetailInfoCard
                  label="Estimated recycling value"
                  value={recyclingValue.estimated_value || "Unknown"}
                />
                <DetailInfoCard
                  label="Selling method"
                  value={recyclingValue.selling_method || "Unknown"}
                />
                <DetailInfoCard
                  label="Predicted class"
                  value={prediction.predicted_class}
                />
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-line bg-white/60 p-5 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">Disposal method</p>
                  <p className="mt-3 text-sm leading-7">{analysis.disposal_method || "Unknown"}</p>
                </div>
                <div className="rounded-2xl border border-line bg-white/60 p-5 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">Environmental impact</p>
                  <p className="mt-3 text-sm leading-7">{analysis.environmental_impact || "Unknown"}</p>
                </div>
                <DetailList
                  title="Valuable materials"
                  items={recyclingValue.valuable_materials || []}
                  emptyText="No valuable materials listed for this waste type."
                />
                <DetailList
                  title="Reuse suggestions"
                  items={analysis.reuse_suggestions || []}
                  emptyText="No reuse suggestions available for this waste type."
                />
                <DetailList
                  title="Safety precautions"
                  items={analysis.safety_precautions || []}
                  emptyText="No extra safety precautions provided."
                />
              </div>

              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HistoryPage() {
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [binFilter, setBinFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadHistory = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetchPredictionHistory();
      setPredictions(response.predictions || []);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail || "Unable to load your saved predictions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((prediction) => {
      const { itemName, binColor } = parsePredictionLabel(
        prediction.predicted_class,
        prediction.analysis
      );
      const searchTarget = `${itemName} ${binColor} ${prediction.analysis.waste_type}`.toLowerCase();
      const matchesSearch = searchTarget.includes(searchValue.trim().toLowerCase());
      const matchesFilter = binFilter === "All" || startCase(prediction.analysis.bin_color) === binFilter;

      return matchesSearch && matchesFilter;
    });
  }, [binFilter, predictions, searchValue]);

  const handleViewDetails = async (predictionId) => {
    setErrorMessage("");
    try {
      const response = await fetchPredictionDetail(predictionId);
      setSelectedPrediction(response.prediction);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail || "Unable to load prediction details."
      );
    }
  };

  const handleDelete = async (predictionId) => {
    setIsDeletingId(predictionId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await deletePrediction(predictionId);
      setPredictions((current) => current.filter((item) => item.id !== predictionId));
      setSuccessMessage(response.message || "Prediction deleted successfully.");
      if (selectedPrediction?.id === predictionId) {
        setSelectedPrediction(null);
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail || "Unable to delete this prediction right now."
      );
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <main className="pt-28">
      <section className="section-gap">
        <div className="section-shell">
          <div className="glass-panel overflow-hidden p-8 sm:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
                  WasteIQ AI history
                </p>
                <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
                  Your saved WasteIQ AI prediction history
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
                  Revisit the predictions you chose to keep, search by waste type,
                  and review disposal details whenever you need them.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-line bg-white/60 px-5 py-4 dark:bg-slate-950/35">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">Saved predictions</p>
                <p className="mt-2 font-heading text-3xl font-bold">{predictions.length}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_14rem]">
              <label className="flex items-center gap-3 rounded-2xl border border-line bg-white/65 px-4 py-3 dark:bg-slate-950/35">
                <HiMagnifyingGlass className="text-lg text-brand" />
                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search by waste name, bin color, or waste type"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>

              <select
                value={binFilter}
                onChange={(event) => setBinFilter(event.target.value)}
                className="rounded-2xl border border-line bg-white/65 px-4 py-3 text-sm outline-none dark:bg-slate-950/35"
              >
                <option>All</option>
                <option>Green</option>
                <option>Blue</option>
                <option>Black</option>
                <option>Red</option>
              </select>
            </div>

            {errorMessage ? (
              <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
                {successMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-10 grid place-items-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
                <p className="mt-4 text-sm text-muted">Loading your saved history...</p>
              </div>
            ) : filteredPredictions.length ? (
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPredictions.map((prediction, index) => {
                  const { itemName, binName, binColor } = parsePredictionLabel(
                    prediction.predicted_class,
                    prediction.analysis
                  );

                  return (
                    <motion.article
                      key={prediction.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -8 }}
                      className="glass-panel overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={prediction.image_url}
                          alt={itemName}
                          className="h-52 w-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-4 text-white">
                          <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                            {formatHistoryDate(prediction.created_at)}
                          </p>
                          <p className="mt-1 text-sm font-semibold">{prediction.confidence.toFixed(2)}% Confidence</p>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-2xl font-bold">{itemName}</h3>
                            <p className="mt-1 text-sm text-muted">{binName}</p>
                          </div>
                          <span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-brand">
                            {binColor}
                          </span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            {prediction.analysis.waste_type}
                          </span>
                          <span className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-slate-950">
                            {prediction.analysis.hazardous ? "Hazard-aware" : "Standard handling"}
                          </span>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => handleViewDetails(prediction.id)}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white/70 px-4 py-3 text-sm font-semibold transition hover:border-brand/35 hover:text-brand dark:bg-slate-950/40"
                          >
                            <HiEye />
                            View details
                          </button>
                          <button
                            onClick={() => handleDelete(prediction.id)}
                            disabled={isDeletingId === prediction.id}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-70"
                          >
                            <HiOutlineTrash />
                            {isDeletingId === prediction.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-10 rounded-[2rem] border border-dashed border-line bg-white/50 px-6 py-14 text-center dark:bg-slate-950/25">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand/10 text-3xl text-brand">
                  <HiSparkles />
                </div>
                <h2 className="mt-5 font-heading text-2xl font-bold">
                  No saved predictions found
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Save a prediction from the analysis page to start building your personal history.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <DetailModal prediction={selectedPrediction} onClose={() => setSelectedPrediction(null)} />
    </main>
  );
}
