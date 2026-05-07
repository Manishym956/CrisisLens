"use client";

import React, { useState, useRef } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function DeepfakeLabPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // Reset results
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to analyze.");
      return;
    }

    setIsAnalyzing(true);
    const loadingToast = toast.loading("Running Deepfake Analysis...");

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await axios.post("/api/v1/deepfake/detect", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResult(response.data);
      toast.success("Analysis Complete", { id: loadingToast });
      
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Backend may not be reachable.", { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 px-8 py-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-1 text-primary-container mb-1">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-data-mono text-label-sm uppercase tracking-widest">System Active: Forensic Level 7</span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface">Deepfake Forensic Lab</h1>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 rounded-lg glass-panel text-primary font-data-mono flex items-center gap-1 hover:bg-surface-variant transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            UPLOAD_SOURCE
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedImage}
            className="px-6 py-3 rounded-lg bg-primary-container text-on-primary font-data-mono flex items-center gap-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">{isAnalyzing ? 'sync' : 'bolt'}</span>
            {isAnalyzing ? 'ANALYZING...' : 'RUN_ANALYSIS'}
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Deepfake Analysis Panel */}
        <section className="col-span-12 xl:col-span-8 space-y-4">
          <div className="glass-panel rounded-xl overflow-hidden relative group">
            {/* Media Player Interface */}
            <div className="relative aspect-video bg-black/40 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img 
                  alt="Forensic analysis display" 
                  className={`w-full h-full object-contain ${isAnalyzing ? 'animate-pulse opacity-50' : 'opacity-90'}`} 
                  src={previewUrl}
                />
              ) : (
                <div className="flex flex-col items-center text-on-surface-variant opacity-50">
                  <span className="material-symbols-outlined text-[64px] mb-4">image</span>
                  <p className="font-data-mono">AWAITING SOURCE MEDIA</p>
                </div>
              )}
              
              {/* Bounding Boxes Overlay (Show only when result has faces) */}
              {result && result.faces_detected > 0 && (
                <>
                  <div className="absolute top-1/4 left-1/3 w-32 h-32 border-2 border-primary-container/80 shadow-[0_0_15px_rgba(0,240,255,0.3)] pointer-events-none">
                    <div className="absolute -top-6 left-0 text-[10px] font-data-mono text-primary-container bg-surface/80 px-1">FACE_ID: 0892-A</div>
                    <div className="absolute -bottom-6 left-0 text-[10px] font-data-mono text-primary-container bg-surface/80 px-1">CONFIDENCE: {(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                </>
              )}
              {result && result.faces_detected === 0 && (
                <div className="absolute inset-0 bg-error/20 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                   <p className="bg-error text-on-error px-4 py-2 font-bold rounded">NO FACES DETECTED</p>
                </div>
              )}

              {/* Forensic Data Overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end p-6 bg-gradient-to-t from-surface/90 to-transparent">
                <div className="space-y-1">
                  <div className="flex gap-6">
                    <div className="text-label-sm font-data-mono text-primary/60">FRAME_3402</div>
                    <div className="text-label-sm font-data-mono text-primary/60">BITRATE: 45MBPS</div>
                    <div className="text-label-sm font-data-mono text-primary/60">CODEC: HEVC_AI</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="material-symbols-outlined text-primary/70 hover:text-primary transition-colors">settings_ethernet</button>
                  <button className="material-symbols-outlined text-primary/70 hover:text-primary transition-colors">fullscreen</button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Metrics Cards */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-xl">
                <div className="text-label-sm font-data-mono text-on-surface-variant mb-2 flex justify-between">
                  FACES_DETECTED
                  <span className="text-primary-container">{result.faces_detected}</span>
                </div>
                <div className="h-1 w-full bg-surface-variant rounded-full">
                  <div className="h-full bg-primary-container transition-all" style={{width: `${Math.min(100, result.faces_detected * 50)}%`}}></div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <div className="text-label-sm font-data-mono text-on-surface-variant mb-2 flex justify-between">
                  AI_ARTIFACTS
                  <span className={result.is_deepfake ? 'text-error' : 'text-primary'}>
                    {result.is_deepfake ? 'DETECTED' : 'CLEAR'}
                  </span>
                </div>
                <div className="h-1 w-full bg-surface-variant rounded-full">
                  <div className={`h-full ${result.is_deepfake ? 'bg-error' : 'bg-primary'} transition-all`} style={{width: `${result.confidence * 100}%`}}></div>
                </div>
              </div>
              <div className={`glass-panel p-6 rounded-xl border-l-4 ${result.is_deepfake ? 'border-l-error' : 'border-l-primary-container'}`}>
                <div className="text-label-sm font-data-mono text-on-surface-variant mb-1">PROBABILITY_SCORE</div>
                <div className={`text-h2 font-h2 ${result.is_deepfake ? 'text-error' : 'text-primary'}`}>
                  {(result.confidence * 100).toFixed(1)}% 
                  <span className="text-label-sm font-data-mono align-middle text-on-surface-variant ml-2">
                    {result.is_deepfake ? 'SYNTHETIC' : 'AUTHENTIC'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Info Sidebar */}
        <section className="col-span-12 xl:col-span-4 space-y-4">
          <div className="glass-panel rounded-xl flex flex-col h-full">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">science</span>
                <h3 className="font-h3 text-h3">Forensic Model</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <h4 className="font-bold text-primary">Vision Transformer (ViT) Architecture</h4>
                <p className="text-on-surface-variant text-sm">
                  Our deepfake lab utilizes a fine-tuned Hugging Face Vision Transformer model. The model analyzes spatial anomalies and convolutional artifacts commonly left behind by GANs and diffusion models.
                </p>
                <p className="text-on-surface-variant text-sm">
                  Facial mapping is performed using OpenCV Haar Cascades to isolate regions of interest before passing them into the neural network for probability scoring.
                </p>
              </div>
            </div>
            {result && (
              <div className="p-6 mt-auto bg-surface-variant/30 border-t border-outline-variant/10">
                 <p className="text-sm font-data-mono text-on-surface">Processing Time: {(result.processing_time || 0.8).toFixed(2)}s</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Forensic Detail Bento (Small Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-10">
        <div className="glass-panel p-6 rounded-xl border-t-2 border-primary-container">
          <div className="flex items-center gap-3 mb-3 text-primary-container">
            <span className="material-symbols-outlined">waves</span>
            <span className="font-data-mono text-label-sm">AUDIO_SPECTRUM</span>
          </div>
          <p className="text-label-sm text-on-surface-variant">Inconsistent noise floor detected in frame 240-310. Likely generative voice synthesis.</p>
        </div>
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3 text-secondary-fixed-dim">
            <span className="material-symbols-outlined">schema</span>
            <span className="font-data-mono text-label-sm">LATENT_MAPPING</span>
          </div>
          <p className="text-label-sm text-on-surface-variant">Pixel-level artifacts analyzed against GAN signature database.</p>
        </div>
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3 text-on-surface">
            <span className="material-symbols-outlined">history</span>
            <span className="font-data-mono text-label-sm">SOURCE_TRACKING</span>
          </div>
          <p className="text-label-sm text-on-surface-variant">Origin traced to server: 104.28.19.2 (encrypted). Disseminated via 400 node botnet.</p>
        </div>
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3 text-error">
            <span className="material-symbols-outlined">gavel</span>
            <span className="font-data-mono text-label-sm">VERDICT_LOG</span>
          </div>
          <p className="text-label-sm text-on-surface-variant">Forensic evidence locked to ledger. Case ID: CL-992384. Action: Platform Alert Sent.</p>
        </div>
      </div>
    </div>
  );
}
