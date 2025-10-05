"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCamera,
  FiUpload,
  FiZap,
  FiActivity,
  FiDownload,
} from "react-icons/fi";
import { FaLeaf, FaMicroscope } from "react-icons/fa";
import DiseaseInfo from "../components/DiseaseInfo";
import { marked } from "marked";
import { useSelector } from "react-redux";

const Particles = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-emerald-600/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${10 + Math.random() * 20}s infinite linear`,
        }}
        suppressHydrationWarning
      />
    ))}
  </div>
);

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [html2pdfLib, setHtml2pdfLib] = useState<any>(null); // ✅ dynamic import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasResults, setHasResults] = useState(false);
  const [generatedInfo, setGeneratedInfo] = useState<string>("");
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);
  const currentLanguage = useSelector(
    (state) =>
      (state as { language: { currentLanguage: string } }).language
        .currentLanguage
  );

  // ✅ Dynamically import html2pdf only on client
  useEffect(() => {
    import("html2pdf.js").then((mod) => setHtml2pdfLib(mod.default));
  }, []);

  useEffect(() => {
    if (hasResults) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [hasResults]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setGeneratedInfo("");
    setResult("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
  });

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setGeneratedInfo("");
      setResult("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setGeneratedInfo("");
    setResult("");
    setHasResults(false);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/infer", {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setResult(data.result || data.error || "Unknown result");
      setHasResults(true);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error processing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInfo = async () => {
    if (!result) {
      alert("No diagnosis results available");
      return;
    }

    setLoadingInfo(true);
    setGeneratedInfo("");

    try {
      const res = await fetch("/api/generate-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis: result,
          language: currentLanguage,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate report");
      }

      const data = await res.json();
      if (!data.info) throw new Error("Empty response from server");

      setGeneratedInfo(data.info);
    } catch (error) {
      console.error("Generation error:", error);
      setGeneratedInfo(
        error instanceof Error ? error.message : "Failed to generate report"
      );
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleDownloadReport = () => {
    if (!generatedInfo || !html2pdfLib) return;

    const diagnosis =
      typeof result === "string"
        ? result
        : typeof result === "object" && result !== null
        ? JSON.stringify(result)
        : "Plant Disease";

    const htmlContent = marked.parse(generatedInfo);

    const imageHTML = preview
      ? `<div style="text-align:center; margin:20px 0;">
         <img src="${preview}" alt="Uploaded Plant" 
              style="max-width:100%; border-radius:12px; border:1px solid #ddd;" />
       </div>`
      : "";

    const element = document.createElement("div");
    element.innerHTML = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h1 style="color: #047857;">🌿 Plant Disease Report</h1>
      <h2 style="margin-top: 10px;">Diagnosis: ${diagnosis}</h2>
      <hr/>
      ${imageHTML}
      ${htmlContent}
    </div>
  `;

    const cleanResult =
      diagnosis
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "") || "plant_disease";

    const opt = {
      margin: 0.5,
      filename: `${cleanResult}_report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdfLib.set(opt).from(element).save();
  };

  return (
    <div className="pt-15 min-h-screen bg-gradient-to-br from-white via-slate-50 to-gray-50 flex flex-col items-center justify-center relative overflow-hidden padding: pt-1 margin: mt-1">
      <Particles />

      <div
        className={`relative bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-200 p-8 shadow-xl w-full max-w-2xl mx-4 mb-8 ${
          hasResults ? "min-h-[80vh]" : ""
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors group">
            <FiArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
            <span className="font-medium">Return Home</span>
          </Link>
          <FaMicroscope className="w-8 h-8 text-emerald-600" />
        </div>

        {/* Upload Section */}
        <div
          {...getRootProps()}
          className="group relative h-96 rounded-2xl border-2 border-dashed border-gray-200 bg-blue-50/50 transition-all hover:border-emerald-500">
          <input {...getInputProps()} />
          <FiUpload className="w-16 h-16 text-emerald-600 mb-4 mx-auto" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Drag Plant Image
            </h2>
            <p className="text-gray-600">Supported formats: PNG, JPG, JPEG</p>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                triggerCamera();
              }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white text-emerald-600 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
              <FiCamera className="w-5 h-5" />
              Capture Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </motion.div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-600 cursor-pointer text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-200 transition-all mt-8 disabled:opacity-50">
          {loading ? (
            <div className="flex items-center gap-2">
              <FiZap className="w-5 h-5 animate-pulse" />
              Processing Analysis...
            </div>
          ) : (
            <>
              <FaLeaf className="w-5 h-5" />
              Start Analysis
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <FiActivity className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  Diagnosis Report
                </h3>
                <p className="text-gray-700 mt-2">{result}</p>
              </div>
            </div>

            {!generatedInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6">
                <button
                  onClick={handleGenerateInfo}
                  disabled={loadingInfo}
                  className="w-full bg-gradient-to-r from-green-100 to-green-70 cursor-pointer hover:from-teal-200 hover:to-green-100 text-emerald-700 px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300">
                  {loadingInfo ? (
                    <>
                      <FiZap className="animate-spin" />
                      Generating Comprehensive Report...
                    </>
                  ) : (
                    <>
                      <FaMicroscope className="w-5 h-5" />
                      Deep Dive Analysis
                      <FiArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {generatedInfo && (
              <div className="space-y-6 mt-6">
                <DiseaseInfo content={generatedInfo} />
                <button
                  onClick={handleDownloadReport}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-md transition-all">
                  <FiDownload className="w-5 h-5" />
                  Download Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
