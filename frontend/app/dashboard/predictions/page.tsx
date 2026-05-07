"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await axios.get("/api/v1/predictions/");
        // Check if there's enough data (the API returns {message: "Not enough data"} if db is empty)
        if (res.data.error || res.data.message) {
          toast(res.data.error || res.data.message, { icon: '⚠️' });
        } else {
          setPredictions(res.data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load predictions. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 space-y-10">
      {/* Header Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-h1 text-h1 text-primary glow-cyan mb-1">Predictive Dashboard</h1>
            <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl">Forecasting information warfare maneuvers using heuristic analysis and neural artifact detection.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-gradient-to-r from-[#00dbe9] to-[#571bc1] hover:shadow-[0_0_20px_rgba(0,219,233,0.4)] hover:-translate-y-0.5 transition-all px-6 py-3 rounded-lg text-on-primary font-data-mono text-data-mono flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">download</span> EXPORT REPORT
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Trend Heatmap: Dark world map */}
        <div className="lg:col-span-8 glass-panel rounded-xl overflow-hidden relative group">
          <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">public</span>
              <h2 className="font-h3 text-h3">Global Threat Heatmap</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-error">
                <span className="w-2 h-2 rounded-full bg-error threat-pulse"></span> CRITICAL HOTSPOTS
              </span>
            </div>
          </div>
          <div className="relative h-[450px] bg-surface-container-lowest overflow-hidden">
            <img 
              className="w-full h-full object-cover opacity-60" 
              alt="World Map" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0CT2LUTYL63du1re5-5ZXMS_KFg7iWc5dPxO2nsqLqibGzhRe9SoraUZQ2P7yKtrC8HvQZVjaN-DNokAu7wSEDCYGA43tYU9Azooxl1C4Za4PFRmoiqeQZWVmC4ZkXtcrgAo83LjGJmZWSCdH4dUM_qhU3OluhyChcct2mLnYdH2FOwDYi9ncqeO_f-vvJAH2e2vpR7xJA077H_YCuDL-vl-TtQ0V0w4ngyZ4eBcTfZ_EdYMWMT387BD2tWz4K3FoPy2SBz5HxK0" 
            />
            {/* Dynamic Map Points (Mocked visually but populated by trending topics if possible) */}
            <div className="absolute top-1/4 left-1/3 p-3 glass-panel rounded-lg border-error/30 animate-pulse">
              <p className="text-error font-data-mono text-data-mono">LATAM: CLUSTER_99</p>
              <p className="text-on-surface-variant text-[10px]">92% Coordination Match</p>
            </div>
            <div className="absolute bottom-1/3 right-1/4 p-3 glass-panel rounded-lg border-primary/30">
              <p className="text-primary font-data-mono text-data-mono">APAC: NODE_ACTIVE</p>
              <p className="text-on-surface-variant text-[10px]">Anomalous Bot Velocity</p>
            </div>
          </div>
        </div>

        {/* Topic Velocity: Glowing line chart */}
        <div className="lg:col-span-4 glass-panel rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary">insights</span>
              <h2 className="font-h3 text-h3 text-secondary">Topic Velocity</h2>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-16 bg-surface-variant/50 rounded"></div>
                  <div className="h-16 bg-surface-variant/50 rounded"></div>
                  <div className="h-16 bg-surface-variant/50 rounded"></div>
                </div>
              ) : predictions && predictions.trending_topics ? (
                predictions.trending_topics.slice(0,3).map((topic: string, i: number) => {
                  const colors = ['#ffb4ab', '#00f0ff', '#d0bcff'];
                  const textColors = ['text-error', 'text-primary', 'text-secondary'];
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-label-sm text-label-sm">
                        <span className="text-on-surface">#{topic.replace(/\s+/g, '')}</span>
                        <span className={`${textColors[i]} font-bold`}>+{(Math.random() * 300 + 100).toFixed(0)}%</span>
                      </div>
                      <div className="relative h-16 w-full overflow-hidden">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 64">
                          <path className="opacity-80" d={`M0 ${64-i*5} L100 ${50-i*10} L200 ${40-i*5} L300 ${20-i*8} L400 5`} fill="none" stroke={colors[i]} strokeWidth="2"></path>
                        </svg>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-on-surface-variant text-sm">Insufficient data. Verify more news items first.</p>
              )}
            </div>
          </div>
          <div className="pt-6 border-t border-outline-variant/10 mt-6">
            <p className="font-data-mono text-data-mono text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">timer</span> LIVE AI INFERENCE
            </p>
          </div>
        </div>

        {/* Predictive Cards */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {loading ? (
            [1,2,3].map(i => <div key={i} className="glass-panel rounded-xl h-48 animate-pulse bg-surface-variant/20"></div>)
          ) : predictions && predictions.emerging_threats ? (
            predictions.emerging_threats.map((threat: any, idx: number) => {
              const isCritical = threat.confidence_level === 'High';
              return (
                <div key={idx} className={`glass-panel rounded-xl p-6 relative overflow-hidden ${isCritical ? 'border-error/20 threat-pulse' : 'border-primary/20'}`}>
                  <div className="absolute top-0 right-0 p-3">
                    <span className={`${isCritical ? 'bg-error text-on-error' : 'bg-primary-container text-on-primary-container'} font-data-mono text-[10px] px-1 py-[2px] rounded uppercase`}>
                      {threat.confidence_level} RISK
                    </span>
                  </div>
                  <div className="flex items-start gap-3 mb-6">
                    <div className={`${isCritical ? 'bg-error-container/20 text-error' : 'bg-primary-container/20 text-primary'} p-1 rounded-lg`}>
                      <span className="material-symbols-outlined">{isCritical ? 'warning' : 'analytics'}</span>
                    </div>
                    <div>
                      <h4 className={`font-h3 text-h3 ${isCritical ? 'text-error' : 'text-primary'}`}>{threat.category}</h4>
                      <p className="text-on-surface-variant text-label-sm font-label-sm">ID: PRD-{Math.floor(Math.random()*1000)}</p>
                    </div>
                  </div>
                  <p className="font-h3 text-h3 mb-3 line-clamp-2">{threat.predicted_narrative}</p>
                  
                  <div className="bg-surface-container-low p-3 rounded-lg mt-auto">
                    <p className="text-on-surface-variant font-body-md text-body-md italic leading-tight text-sm">
                      Keywords: {threat.related_keywords.join(", ")}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-10 text-on-surface-variant">
              No predictive data available. The system needs more verified fake news to train on.
            </div>
          )}

          {/* Special Static Summaries from Predictions */}
          {predictions && predictions.election_misinformation_risk && (
            <div className="col-span-3 lg:col-span-12 glass-panel p-6 rounded-xl mt-6">
               <h3 className="text-primary font-h3 mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined">policy</span> Election Misinformation Risk
               </h3>
               <p className="text-on-surface-variant">{predictions.election_misinformation_risk}</p>
            </div>
          )}
          {predictions && predictions.scam_narrative_prediction && (
            <div className="col-span-3 lg:col-span-12 glass-panel p-6 rounded-xl mt-6">
               <h3 className="text-secondary font-h3 mb-2 flex items-center gap-2">
                 <span className="material-symbols-outlined">money_off</span> Scam Narrative Forecast
               </h3>
               <p className="text-on-surface-variant">{predictions.scam_narrative_prediction}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
