"use client";

import React, { useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function VerifyNewsPage() {
  const [newsText, setNewsText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

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
              <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 outline-none" placeholder="URL Endpoint (Optional)" type="text" />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="relative overflow-hidden bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-fixed px-16 py-3 font-bold rounded-lg group transition-transform active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="material-symbols-outlined">{isAnalyzing ? 'sync' : 'search_check'}</span>
                {isAnalyzing ? 'Analyzing...' : 'Analyze Threat'}
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

      {/* Consensus Grid - Only show if we have results */}
      {result && (
        <>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">hub</span>
              <h3 className="font-h3 text-h3 text-on-surface">Intelligence Consensus</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Map through AI responses */}
              {Object.entries(result.verification_result.ai_responses).map(([modelName, response]: [string, any]) => {
                const isFake = response.is_fake;
                const colorClass = isFake ? "border-error text-error bg-error/20" : "border-primary text-primary bg-primary/20";
                const bgFill = isFake ? "bg-error" : "bg-primary";
                
                return (
                  <div key={modelName} className={`glass-panel p-6 rounded-xl border-l-4 ${isFake ? 'border-error' : 'border-primary'} space-y-6`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">{modelName.includes('openai') ? 'robot_2' : modelName.includes('gemini') ? 'google_plus_reshare' : 'bolt'}</span>
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
                        <span className={isFake ? 'text-error' : 'text-primary'}>{(response.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
                        <div className={`h-full ${bgFill}`} style={{ width: `${response.confidence * 100}%` }}></div>
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
                  {Object.entries(result.verification_result.ai_responses).map(([model, response]: [string, any], idx, arr) => (
                    <React.Fragment key={model}>
                      <div className={`px-6 py-3 border rounded-lg ${response.is_fake ? 'bg-error/10 border-error/30' : 'bg-primary/10 border-primary/30'}`}>
                        <span className={`font-h3 text-h3 ${response.is_fake ? 'text-error' : 'text-primary'}`}>
                          {response.is_fake ? 'FAKE' : 'REAL'}
                        </span>
                      </div>
                      {idx < arr.length - 1 && <span className="text-h3 font-bold text-on-surface-variant">+</span>}
                    </React.Fragment>
                  ))}
                  
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
                  The engine has determined a {(result.verification_result.consensus.confidence * 100).toFixed(1)}% probability that this is {result.verification_result.consensus.is_fake ? 'misinformation' : 'factual'}.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
