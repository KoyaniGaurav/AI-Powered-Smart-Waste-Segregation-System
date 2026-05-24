import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HiArchiveBox, HiShieldCheck } from "react-icons/hi2";
import PredictionStudio from "../components/PredictionStudio";
import { useAuth } from "../context/AuthContext";
import { predictWaste, savePrediction } from "../services/api";

export default function PredictionPage() {
  const { isAuthenticated } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPrediction, setIsSavingPrediction] = useState(false);
  const [isPredictionSaved, setIsPredictionSaved] = useState(false);
  const objectUrlRef = useRef("");

  const resetSaveState = () => {
    setSaveMessage("");
    setSaveErrorMessage("");
    setIsPredictionSaved(false);
  };

  const updatePreview = (file) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    if (!file) {
      objectUrlRef.current = "";
      setPreviewUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = (file) => {
    if (!file) {
      setSelectedFile(null);
      updatePreview(null);
      setResult(null);
      setErrorMessage("");
      resetSaveState();
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Please upload an image smaller than 10 MB.");
      return;
    }

    setSelectedFile(file);
    updatePreview(file);
    setResult(null);
    setErrorMessage("");
    resetSaveState();
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setErrorMessage("Please upload or capture a waste image before predicting.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    resetSaveState();

    try {
      const response = await predictWaste(selectedFile);
      setResult(response);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "The prediction service is unavailable right now. Please try again.";
      setResult(null);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrediction = async () => {
    if (!result?.success || isPredictionSaved) {
      return;
    }

    setIsSavingPrediction(true);
    setSaveErrorMessage("");
    setSaveMessage("");

    try {
      const response = await savePrediction({
        image_path: result.prediction.image_path,
        predicted_class: result.prediction.class,
        confidence: result.prediction.confidence,
      });

      setSaveMessage(response.message || "Prediction saved successfully.");
      setIsPredictionSaved(true);
    } catch (error) {
      setSaveErrorMessage(
        error?.response?.data?.detail || "Unable to save this prediction right now."
      );
    } finally {
      setIsSavingPrediction(false);
    }
  };

  return (
    <main className="pt-28">
      <section className="relative overflow-hidden pb-8">
        <div className="hero-orb left-[-4rem] top-16 h-52 w-52 bg-brand-bright/20" />
        <div className="hero-orb right-[-3rem] top-10 h-56 w-56 bg-brand-moss/20" />
        <div className="section-shell relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel overflow-hidden px-6 py-10 sm:px-10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-brand-moss/10" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-brand/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.32em] text-brand dark:bg-slate-950/45">
                  WasteIQ AI Prediction
                </span>
                <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                  Upload waste photos with WasteIQ AI
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                  Review a clean result experience with formatted waste labels, bin
                  guidance, confidence scoring, and practical next steps.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 p-5 text-white dark:bg-slate-800">
                  <HiArchiveBox className="text-3xl text-teal-300" />
                  <p className="mt-4 text-sm uppercase tracking-[0.22em] text-slate-400">Output</p>
                  <p className="mt-2 font-heading text-xl font-bold">Clean waste classification</p>
                </div>
                <div className="rounded-3xl bg-white/70 p-5 dark:bg-slate-950/35">
                  <HiShieldCheck className="text-3xl text-brand" />
                  <p className="mt-4 text-sm uppercase tracking-[0.22em] text-muted">Guidance</p>
                  <p className="mt-2 font-heading text-xl font-bold">Bin, safety, and recycling tips</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PredictionStudio
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        result={result}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        isSavingPrediction={isSavingPrediction}
        isPredictionSaved={isPredictionSaved}
        errorMessage={errorMessage}
        saveMessage={saveMessage}
        saveErrorMessage={saveErrorMessage}
        onFileSelect={handleFileSelect}
        onPredict={handlePredict}
        onSavePrediction={handleSavePrediction}
        onReset={() => handleFileSelect(null)}
      />
    </main>
  );
}
