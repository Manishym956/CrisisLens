"use client";

import React, { useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function VerifyNewsPage() {
  const [newsText, setNewsText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUrlAnalyzing, setIsUrlAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [urlResult, setUrlResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!newsText.trim()) {
      toast.error("Please enter some text to analyze.");
      return;
    }

    setIsAnalyzing(true);
    const loadingToast = toast.loading("Analyzing Threat via Consensus Engine...");

    try {
      const response = await axios.post("/api/v1/news/store-news", {
        news_text: newsText,
        source_virality_score: 0.85
      });
      setResult(response.data);
      toast.success("Analysis Complete", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze threat. Check API connection.", { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlAnalyze = async () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast.error("Please enter a URL to verify.");
      return;
    }
    setIsUrlAnalyzing(true);
    setUrlResult(null);
    const loadingToast = toast.loading("Scanning URL legitimacy...");
    try {
      const response = await axios.post("/api/v1/verification/verify-url", { url: trimmed });
      setUrlResult(response.data);
      toast.success("URL scan complete", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("URL scan failed.", { id: loadingToast });
    } finally {
      setIsUrlAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 space-y-10">
      {/* Page Header */}
      <header className="space-y-1">
        <h2 className="font-h2 text-h2 text-primary font-bold">Verify News Intelligence</h2>
        <p className="text-on-surface-variant text-body-lg">Cross-reference information across the global AI consensus engine.</p>
      </header>

      {/* Input Zone Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Text Analysis Input */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl space-y-6 neon-border-focus transition-all">
          <div className="flex items-center justify-between">
            <label className="font-data-mono text-data-mono text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">article</span>
              CONTENT ANALYSIS
            </label>
            <span className="text-label-sm text-on-surface-variant">{4500 - newsText.length} chars remaining</span>
          </div>
          <textarea 
            className="w-full h-48 bg-surface-container-low/50 border border-outline-variant/30 rounded-lg p-6 text-on-surface focus:ring-1 focus:ring-primary-container focus:outline-none transition-all resize-none" 
            placeholder="Paste news article transcript or suspicious text here for deep analysis..."
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
          ></textarea>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow glass-panel bg-surface-container-highest/20 rounded-lg flex items-center px-6 border border-outline-variant/20 focus-within:border-primary-container/50">
              <span className="material-symbols-outlined text-on-surface-variant mr-3">link</span>
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 outline-none"
                placeholder="Paste URL to verify legitimacy (Optional)"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlAnalyze()}
              />
              {urlInput && (
                <button
                  onClick={handleUrlAnalyze}
                  disabled={isUrlAnalyzing}
                  className="ml-2 px-4 py-1.5 rounded-md bg-primary-container/70 text-on-primary text-label-sm font-bold hover:bg-primary-container transition-all disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[14px]">{isUrlAnalyzing ? 'sync' : 'travel_explore'}</span>
                  {isUrlAnalyzing ? 'Scanning...' : 'Scan URL'}
                </button>
              )}
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="relative overflow-hidden bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-fixed px-16 py-3 font-bold rounded-lg group transition-transform active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="material-symbols-outlined">{isAnalyzing ? 'sync' : 'search_check'}</span>
                {isAnalyzing ? 'Analyzing...' : 'Verify-News'}
              </span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </button>
          </div>
        </div>

        {/* Media Uploader & Threat Meter */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-xl flex-grow border-dashed border-2 border-outline-variant/40 flex flex-col items-center justify-center text-center group hover:border-primary-container/60 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-xl text-primary mb-3 group-hover:scale-110 transition-transform text-3xl">upload_file</span>
            <p className="font-data-mono text-data-mono text-on-surface">DRAG MEDIA ANALYTICS</p>
            <p className="text-label-sm text-on-surface-variant mt-1">Deepfake detection support</p>
          </div>

          {/* Threat Score Meter */}
          <div className={`glass-panel p-6 rounded-xl flex flex-col items-center justify-center space-y-3 ${result ? (result.threat_ranking.risk_classification === 'CRITICAL' ? 'bg-error-container/5 border-error/20' : 'bg-primary-container/5 border-primary/20') : ''}`}>
            <h4 className={`font-data-mono text-data-mono ${result?.threat_ranking?.risk_classification === 'CRITICAL' ? 'text-error' : 'text-primary'}`}>THREAT LEVEL</h4>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-surface-variant" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className={result?.threat_ranking?.risk_classification === 'CRITICAL' ? 'text-error transition-all duration-1000' : 'text-primary transition-all duration-1000'} 
                  cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" 
                  strokeDasharray="364.4" 
                  strokeDashoffset={result ? 364.4 - (364.4 * (result.threat_ranking.total_threat_score / 10)) : 364.4} 
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-h2 font-bold ${result?.threat_ranking?.risk_classification === 'CRITICAL' ? 'text-error' : 'text-primary'}`}>
                  {result ? result.threat_ranking.total_threat_score.toFixed(1) : '-'}
                </span>
                <span className={`text-[10px] font-bold ${result?.threat_ranking?.risk_classification === 'CRITICAL' ? 'text-error' : 'text-primary'} tracking-widest`}>
                  {result ? result.threat_ranking.risk_classification : 'STANDBY'}
                </span>
              </div>
              {result?.threat_ranking?.risk_classification === 'CRITICAL' && (
                <div className="absolute inset-0 rounded-full threat-pulse opacity-50 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* URL Legitimacy Result Panel */}
      {urlResult && (
        <section className="glass-panel rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">travel_explore</span>
              <h3 className="font-h3 text-h3 text-on-surface">URL Legitimacy Scan</h3>
              <span className="font-data-mono text-label-sm text-on-surface-variant opacity-60 truncate max-w-[300px]">{urlResult.url}</span>
            </div>
            <span className={`px-4 py-1.5 rounded-full font-bold text-label-sm ${
              urlResult.legitimacy === 'LEGITIMATE' ? 'bg-primary/20 text-primary border border-primary/30' :
              urlResult.legitimacy === 'SUSPICIOUS'  ? 'bg-warning/20 text-yellow-400 border border-yellow-400/30' :
              'bg-error/20 text-error border border-error/30'
            }`}>
              {urlResult.legitimacy}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-x divide-outline-variant/10">
            {/* Trust Score */}
            <div className="p-6 flex flex-col items-center justify-center space-y-2">
              <p className="font-data-mono text-label-sm text-on-surface-variant">TRUST SCORE</p>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-surface-variant"/>
                  <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="6"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * urlResult.trust_score / 100)}
                    className={`transition-all duration-1000 ${
                      urlResult.trust_score >= 70 ? 'text-primary' :
                      urlResult.trust_score >= 40 ? 'text-yellow-400' : 'text-error'
                    }`}
                  />
                </svg>
                <span className={`absolute text-h3 font-bold ${
                  urlResult.trust_score >= 70 ? 'text-primary' :
                  urlResult.trust_score >= 40 ? 'text-yellow-400' : 'text-error'
                }`}>{urlResult.trust_score}</span>
              </div>
              <p className="text-label-sm text-on-surface-variant">{urlResult.domain}</p>
            </div>

            {/* Domain Signals */}
            <div className="p-6 space-y-3">
              <p className="font-data-mono text-label-sm text-on-surface-variant mb-3">DOMAIN SIGNALS</p>
              <div className="space-y-2">
                {urlResult.domain_signals?.map((signal: string, i: number) => (
                  <p key={i} className="text-label-sm text-on-surface">{signal}</p>
                ))}
                <p className={`text-label-sm ${urlResult.content_fetched ? 'text-primary' : 'text-on-surface-variant opacity-60'}`}>
                  {urlResult.content_fetched ? '✅ Page content fetched & analyzed' : '⚠️ Page content unavailable — URL-only analysis'}
                </p>
              </div>
            </div>

            {/* AI Consensus on URL */}
            <div className="p-6 space-y-3">
              <p className="font-data-mono text-label-sm text-on-surface-variant mb-3">AI CONTENT VERDICT</p>
              {['openai','gemini','groq'].map((m) => {
                const r = urlResult.ai_verification?.[m];
                if (!r || r.error) return (
                  <div key={m} className="flex items-center gap-2 text-on-surface-variant opacity-50">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    <span className="text-label-sm capitalize">{m}: unavailable</span>
                  </div>
                );
                return (
                  <div key={m} className="flex items-center justify-between">
                    <span className="font-data-mono text-label-sm capitalize text-on-surface-variant">{m}</span>
                    <span className={`text-label-sm font-bold px-2 py-0.5 rounded ${r.is_fake ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'}`}>
                      {r.is_fake ? 'SUSPICIOUS' : 'CREDIBLE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Consensus Grid - Only show if we have results */}
      {result && (
        <>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">hub</span>
              <h3 className="font-h3 text-h3 text-on-surface">Intelligence Consensus</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Map through AI responses — backend returns {openai, gemini, groq} */}
              {["openai", "gemini", "groq"].map((modelName) => {
                const response = result.verification_result?.[modelName];
                if (!response || response.error) {
                  return (
                    <div key={modelName} className="glass-panel p-6 rounded-xl border-l-4 border-outline-variant/30 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-bright/50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">{modelName === 'openai' ? 'robot_2' : modelName === 'gemini' ? 'google_plus_reshare' : 'bolt'}</span>
                        </div>
                        <p className="font-data-mono text-data-mono text-on-surface-variant capitalize">{modelName}</p>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant opacity-70">
                        <span className="material-symbols-outlined text-[16px]">warning</span>
                        <p className="text-label-sm">Model unavailable — could not complete analysis</p>
                      </div>
                    </div>
                  );
                }
                const isFake = response.is_fake;
                const colorClass = isFake ? "border-error text-error bg-error/20" : "border-primary text-primary bg-primary/20";
                const bgFill = isFake ? "bg-error" : "bg-primary";
                const confidence = response.confidence_score ?? response.confidence ?? 0;
                
                return (
                  <div key={modelName} className={`glass-panel p-6 rounded-xl border-l-4 ${isFake ? 'border-error' : 'border-primary'} space-y-6`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">{modelName === 'openai' ? 'robot_2' : modelName === 'gemini' ? 'google_plus_reshare' : 'bolt'}</span>
                        </div>
                        <div>
                          <p className="font-data-mono text-data-mono text-primary capitalize">{modelName}</p>
                          <p className="text-[10px] text-on-surface-variant">Linguistic Pattern Matching</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-label-sm rounded-full font-bold ${colorClass}`}>
                        {isFake ? 'FAKE' : 'REAL'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-label-sm">
                        <span className="text-on-surface-variant">Confidence</span>
                        <span className={isFake ? 'text-error' : 'text-primary'}>{(confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
                        <div className={`h-full ${bgFill}`} style={{ width: `${confidence * 100}%` }}></div>
                      </div>
                    </div>
                    <p className="text-label-sm text-on-surface-variant leading-relaxed">
                      Reasoning: {response.reasoning}
                    </p>
                  </div>
                );
              })}

            </div>
          </section>

          {/* Consensus Engine Logic Card */}
          <section className="glass-panel p-16 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <span className="material-symbols-outlined text-[120px]">memory</span>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="space-y-3">
                <h4 className="font-data-mono text-data-mono text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined">settings_input_component</span>
                  CONSENSUS ENGINE LOGIC
                </h4>
                <div className="flex flex-wrap items-center gap-6">
                  {/* Visualizing the votes */}
                  {["openai", "gemini", "groq"].map((model, idx, arr) => {
                    const response = result.verification_result?.[model];
                    if (!response || response.error) return null;
                    return (
                    <React.Fragment key={model}>
                      <div className={`px-6 py-3 border rounded-lg ${response.is_fake ? 'bg-error/10 border-error/30' : 'bg-primary/10 border-primary/30'}`}>
                        <span className={`font-h3 text-h3 ${response.is_fake ? 'text-error' : 'text-primary'}`}>
                          {response.is_fake ? 'FAKE' : 'REAL'}
                        </span>
                      </div>
                      {idx < arr.length - 1 && <span className="text-h3 font-bold text-on-surface-variant">+</span>}
                    </React.Fragment>
                    );
                  })}
                  
                  <span className="text-h3 font-bold text-on-surface-variant">=</span>
                  
                  <div className={`px-16 py-3 border-2 rounded-xl shadow-lg ${result.verification_result.consensus.is_fake ? 'bg-error border-error/50 shadow-error/20 text-on-error' : 'bg-primary border-primary/50 shadow-primary/20 text-on-primary'}`}>
                    <span className="font-h3 text-h3">
                      {result.verification_result.consensus.is_fake ? 'THREAT DETECTED' : 'VERIFIED SAFE'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="max-w-[384px] text-right">
                <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Inference Conclusion</p>
                <p className="text-body-md text-on-surface">
                  {(() => {
                    const conf = result.verification_result?.confidence;
                    const isFake = result.verification_result?.consensus?.is_fake;
                    const status = result.verification_result?.consensus?.status;
                    if (status === 'Undetermined') {
                      return 'Verification inconclusive — all AI models encountered errors. Please retry.';
                    }
                    if (typeof conf !== 'number' || isNaN(conf)) {
                      return `The consensus engine has classified this content as ${isFake ? 'MISINFORMATION' : 'FACTUAL'}.`;
                    }
                    return `The engine has determined a ${(conf * 100).toFixed(1)}% probability that this is ${isFake ? 'misinformation' : 'factual'}.`;
                  })()}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
